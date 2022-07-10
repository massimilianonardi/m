package m.web.jetty;


import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeoutException;

import javax.servlet.AsyncContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.client.ContinueProtocolHandler;
import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.client.ProtocolHandlers;
import org.eclipse.jetty.client.api.Request;
import org.eclipse.jetty.client.api.Response;
import org.eclipse.jetty.client.http.HttpClientTransportOverHTTP;
import org.eclipse.jetty.http.HttpField;
import org.eclipse.jetty.http.HttpHeader;
import org.eclipse.jetty.http.HttpHeaderValue;
import org.eclipse.jetty.http.HttpStatus;
import org.eclipse.jetty.util.HttpCookieStore;
import org.eclipse.jetty.util.ProcessorUtils;
import org.eclipse.jetty.util.log.Log;
import org.eclipse.jetty.util.log.Logger;
import org.eclipse.jetty.util.thread.QueuedThreadPool;



import org.eclipse.jetty.proxy.*;



import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.Iterator;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

import javax.servlet.AsyncContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.client.AsyncContentProvider;
import org.eclipse.jetty.client.api.ContentProvider;
import org.eclipse.jetty.client.api.Request;
import org.eclipse.jetty.client.api.Response;
import org.eclipse.jetty.client.api.Result;
import org.eclipse.jetty.client.util.DeferredContentProvider;
import org.eclipse.jetty.client.util.InputStreamContentProvider;
import org.eclipse.jetty.http.HttpVersion;
import org.eclipse.jetty.util.Callback;
import org.eclipse.jetty.util.IteratingCallback;



import java.net.*;
import java.io.*;
import java.nio.*;
import java.util.*;
import java.util.concurrent.*;

import javax.servlet.*;
import javax.servlet.http.*;

import org.eclipse.jetty.client.*;
import org.eclipse.jetty.client.api.*;
import org.eclipse.jetty.client.util.*;

import org.eclipse.jetty.http.*;

import org.eclipse.jetty.util.*;
import org.eclipse.jetty.util.ssl.*;

import org.eclipse.jetty.proxy.*;

import m.object.*;
import m.conf.*;










public class CustomProxy implements ConfigurableObject
{
  protected static final String CLIENT_REQUEST_ATTRIBUTE = "org.eclipse.jetty.proxy.clientRequest";
  private static final String CONTINUE_ACTION_ATTRIBUTE = ProxyServlet.class.getName() + ".continueAction";
  
  private HttpClient _client;
  private long _timeout;
  private String _hostHeader;
  private boolean _preserveHost;
  private String _viaHost;
  
  protected static final Set<String> HOP_HEADERS;
  static
  {
    Set<String> hopHeaders = new HashSet<>();
    hopHeaders.add("connection");
    hopHeaders.add("keep-alive");
    hopHeaders.add("proxy-authorization");
    hopHeaders.add("proxy-authenticate");
    hopHeaders.add("proxy-connection");
    hopHeaders.add("transfer-encoding");
    hopHeaders.add("te");
    hopHeaders.add("trailer");
    hopHeaders.add("upgrade");
    HOP_HEADERS = Collections.unmodifiableSet(hopHeaders);
  }
  
  public void construct(Obj args) throws Exception
  {
    _client = createHttpClient();
  }
  
  public void construct() throws Exception
  {
    _client = createHttpClient();
  }
  
  public void destruct() throws Exception
  {
    _client.stop();
  }
  
  public void configure(Obj params) throws Exception
  {
  }
  
  public void configure() throws Exception
  {
    destruct();
  }
  
  public void forwardTo(String _prefix, String _proxyTo, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    String rewrittenTarget = rewriteTarget(request, _prefix, _proxyTo);
    
    m.Global.log.debug(request.getRequestURI(), _prefix, _proxyTo, rewrittenTarget);
    
    if(rewrittenTarget == null)
    {
      sendProxyResponseError(request, response, HttpStatus.FORBIDDEN_403);
      return;
    }
    
    Request proxyRequest = _client.newRequest(rewrittenTarget).method(request.getMethod()).version(HttpVersion.fromString(request.getProtocol()));
    copyRequestHeaders(request, proxyRequest);
    addProxyHeaders(request, proxyRequest);
    AsyncContext asyncContext = request.startAsync();
    // We do not timeout the continuation, but the proxy request
    asyncContext.setTimeout(0);
    proxyRequest.timeout(_timeout, TimeUnit.MILLISECONDS);

    proxyRequestContent(request, response, proxyRequest);
    
    sendProxyRequest(request, response, proxyRequest);
  }
  
  protected String rewriteTarget(HttpServletRequest request, String _prefix, String _proxyTo)
  {
    m.Global.log.debug(request.getRequestURI(), _prefix, _proxyTo);
    
    String path = request.getRequestURI();
    if (!_prefix.startsWith("/"))
        _prefix = "/" + _prefix;
    if (!path.startsWith(_prefix))
        return null;

    StringBuilder uri = new StringBuilder(_proxyTo);
//    if (_proxyTo.endsWith("/"))
//        uri.setLength(uri.length() - 1);
    String rest = path.substring(_prefix.length());
    if (!rest.isEmpty())
    {
        if (!rest.startsWith("/"))
            uri.append("/");
        uri.append(rest);
    }

    String query = request.getQueryString();
    if (query != null)
    {
        // Is there at least one path segment ?
        String separator = "://";
        if (uri.indexOf("/", uri.indexOf(separator) + separator.length()) < 0)
            uri.append("/");
        uri.append("?").append(query);
    }
    URI rewrittenURI = URI.create(uri.toString()).normalize();

    return rewrittenURI.toString();
  }
  
  protected void sendProxyResponseError(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, int status)
  {
    try
    {
      if (!proxyResponse.isCommitted())
      {
        proxyResponse.resetBuffer();
        proxyResponse.setHeader(HttpHeader.CONNECTION.asString(), HttpHeaderValue.CLOSE.asString());
      }
      proxyResponse.sendError(status);
    }
    catch(Exception e)
    {
//            _log.ignore(e);
    }
    finally
    {
      if (clientRequest.isAsyncStarted())
        clientRequest.getAsyncContext().complete();
    }
  }
  
  protected void proxyRequestContent(HttpServletRequest request, HttpServletResponse response, Request proxyRequest) throws IOException
  {
    if(hasContent(request))
    {
      if(expects100Continue(request))
      {
        DeferredContentProvider deferred = new DeferredContentProvider();
        proxyRequest.content(deferred);
        proxyRequest.attribute(CLIENT_REQUEST_ATTRIBUTE, request);
        proxyRequest.attribute(CONTINUE_ACTION_ATTRIBUTE, (Runnable)() ->
        {
          try
          {
            ContentProvider provider = new ProxyInputStreamContentProvider(request, response, proxyRequest, request.getInputStream());
            new DelegatingContentProvider(request, proxyRequest, response, provider, deferred).iterate();
          }
          catch(Throwable failure)
          {
            onClientRequestFailure(request, proxyRequest, response, failure);
          }
        });
      }
      else
      {
        proxyRequest.content(new ProxyInputStreamContentProvider(request, response, proxyRequest, request.getInputStream()));
      }
    }
  }
  
  protected HttpClient newHttpClient()
  {
    SslContextFactory sslContextFactory = new SslContextFactory();
    sslContextFactory.setTrustAll(true);
    
    return new HttpClient(sslContextFactory);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    protected HttpClient createHttpClient() throws ServletException
    {
//        ServletConfig config = getServletConfig();

        HttpClient client = newHttpClient();

        // Redirects must be proxied as is, not followed.
        client.setFollowRedirects(false);

        // Must not store cookies, otherwise cookies of different clients will mix.
        client.setCookieStore(new HttpCookieStore.Empty());

        Executor executor;
//        String value = config.getInitParameter("maxThreads");
        String value = "256";
        if (value == null || "-".equals(value))
        {
//            executor = (Executor) getServletContext().getAttribute("org.eclipse.jetty.server.Executor");
//            if (executor==null)
                throw new IllegalStateException("No server executor for proxy");
        }
        else
        {
            QueuedThreadPool qtp= new QueuedThreadPool(Integer.parseInt(value));
//            String servletName = config.getServletName();
            String servletName = "ReverseProxyServlet";
            int dot = servletName.lastIndexOf('.');
            if (dot >= 0)
                servletName = servletName.substring(dot + 1);
            qtp.setName(servletName);
            executor=qtp;
        }

        client.setExecutor(executor);

        value = null;
//        value = config.getInitParameter("maxConnections");
        if (value == null)
            value = "256";
        client.setMaxConnectionsPerDestination(Integer.parseInt(value));

        value = null;
//        value = config.getInitParameter("idleTimeout");
        if (value == null)
            value = "30000";
        client.setIdleTimeout(Long.parseLong(value));

        value = null;
//        value = config.getInitParameter("timeout");
        if (value == null)
            value = "60000";
        _timeout = Long.parseLong(value);

        value = null;
//        value = config.getInitParameter("requestBufferSize");
        if (value != null)
            client.setRequestBufferSize(Integer.parseInt(value));

        value = null;
//        value = config.getInitParameter("responseBufferSize");
        if (value != null)
            client.setResponseBufferSize(Integer.parseInt(value));

        try
        {
            client.start();

            // Content must not be decoded, otherwise the client gets confused.
            client.getContentDecoderFactories().clear();

            // Pass traffic to the client, only intercept what's necessary.
            ProtocolHandlers protocolHandlers = client.getProtocolHandlers();
            protocolHandlers.clear();
            protocolHandlers.put(new ProxyContinueProtocolHandler());

            return client;
        }
        catch (Exception x)
        {
            throw new ServletException(x);
        }
    }
    
    protected void copyRequestHeaders(HttpServletRequest clientRequest, Request proxyRequest)
    {
        // First clear possibly existing headers, as we are going to copy those from the client request.
        proxyRequest.getHeaders().clear();

        Set<String> headersToRemove = findConnectionHeaders(clientRequest);

        for (Enumeration<String> headerNames = clientRequest.getHeaderNames(); headerNames.hasMoreElements();)
        {
            String headerName = headerNames.nextElement();
            String lowerHeaderName = headerName.toLowerCase(Locale.ENGLISH);

            if (HttpHeader.HOST.is(headerName) && !_preserveHost)
                continue;

            // Remove hop-by-hop headers.
            if (HOP_HEADERS.contains(lowerHeaderName))
                continue;
            if (headersToRemove != null && headersToRemove.contains(lowerHeaderName))
                continue;

            for (Enumeration<String> headerValues = clientRequest.getHeaders(headerName); headerValues.hasMoreElements();)
            {
                String headerValue = headerValues.nextElement();
                if (headerValue != null)
                    proxyRequest.header(headerName, headerValue);
            }
        }

        // Force the Host header if configured
        if (_hostHeader != null)
            proxyRequest.header(HttpHeader.HOST, _hostHeader);
    }
    
    protected Set<String> findConnectionHeaders(HttpServletRequest clientRequest)
    {
        // Any header listed by the Connection header must be removed:
        // http://tools.ietf.org/html/rfc7230#section-6.1.
        Set<String> hopHeaders = null;
        Enumeration<String> connectionHeaders = clientRequest.getHeaders(HttpHeader.CONNECTION.asString());
        while (connectionHeaders.hasMoreElements())
        {
            String value = connectionHeaders.nextElement();
            String[] values = value.split(",");
            for (String name : values)
            {
                name = name.trim().toLowerCase(Locale.ENGLISH);
                if (hopHeaders == null)
                    hopHeaders = new HashSet<>();
                hopHeaders.add(name);
            }
        }
        return hopHeaders;
    }
    
    protected boolean expects100Continue(HttpServletRequest request)
    {
        return HttpHeaderValue.CONTINUE.is(request.getHeader(HttpHeader.EXPECT.asString()));
    }
    
    protected void onClientRequestFailure(HttpServletRequest clientRequest, Request proxyRequest, HttpServletResponse proxyResponse, Throwable failure)
    {
        boolean aborted = proxyRequest.abort(failure);
        if (!aborted)
        {
            int status = failure instanceof TimeoutException ?
                    HttpStatus.REQUEST_TIMEOUT_408 :
                    HttpStatus.INTERNAL_SERVER_ERROR_500;
            sendProxyResponseError(clientRequest, proxyResponse, status);
        }
    }
    
    protected void onContinue(HttpServletRequest clientRequest, Request proxyRequest)
    {
//        super.onContinue(clientRequest, proxyRequest);
        Runnable action = (Runnable)proxyRequest.getAttributes().get(CONTINUE_ACTION_ATTRIBUTE);
        Executor executor = _client.getExecutor();
        executor.execute(action);
    }
    
    protected void onServerResponseHeaders(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, Response serverResponse)
    {
        for (HttpField field : serverResponse.getHeaders())
        {
            String headerName = field.getName();
            String lowerHeaderName = headerName.toLowerCase(Locale.ENGLISH);
            if (HOP_HEADERS.contains(lowerHeaderName))
                continue;

            String newHeaderValue = filterServerResponseHeader(clientRequest, serverResponse, headerName, field.getValue());
            if (newHeaderValue == null || newHeaderValue.trim().length() == 0)
                continue;

            proxyResponse.addHeader(headerName, newHeaderValue);
        }

//        if (_log.isDebugEnabled())
//        {
//            StringBuilder builder = new StringBuilder(System.lineSeparator());
//            builder.append(clientRequest.getProtocol()).append(" ").append(proxyResponse.getStatus())
//                    .append(" ").append(serverResponse.getReason()).append(System.lineSeparator());
//            for (String headerName : proxyResponse.getHeaderNames())
//            {
//                builder.append(headerName).append(": ");
//                for (Iterator<String> headerValues = proxyResponse.getHeaders(headerName).iterator(); headerValues.hasNext(); )
//                {
//                    String headerValue = headerValues.next();
//                    if (headerValue != null)
//                        builder.append(headerValue);
//                    if (headerValues.hasNext())
//                        builder.append(",");
//                }
//                builder.append(System.lineSeparator());
//            }
//            _log.debug("{} proxying to downstream:{}{}{}{}{}",
//                    getRequestId(clientRequest),
//                    System.lineSeparator(),
//                    serverResponse,
//                    System.lineSeparator(),
//                    serverResponse.getHeaders().toString().trim(),
//                    System.lineSeparator(),
//                    builder);
//        }
    }

    protected String filterServerResponseHeader(HttpServletRequest clientRequest, Response serverResponse, String headerName, String headerValue)
    {
        return headerValue;
    }

    protected void onProxyResponseSuccess(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, Response serverResponse)
    {
//        if (_log.isDebugEnabled())
//            _log.debug("{} proxying successful", getRequestId(clientRequest));

        AsyncContext asyncContext = clientRequest.getAsyncContext();
        asyncContext.complete();
    }

    protected void onProxyResponseFailure(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, Response serverResponse, Throwable failure)
    {
//        if (_log.isDebugEnabled())
//            _log.debug(getRequestId(clientRequest) + " proxying failed", failure);

        int status = failure instanceof TimeoutException ?
            HttpStatus.GATEWAY_TIMEOUT_504 :
                HttpStatus.BAD_GATEWAY_502;
        int serverStatus = serverResponse == null ? status : serverResponse.getStatus();
        if (expects100Continue(clientRequest) && serverStatus >= HttpStatus.OK_200)
            status = serverStatus;
        sendProxyResponseError(clientRequest, proxyResponse, status);
        
    }

    protected void onResponseContent(HttpServletRequest request, HttpServletResponse response, Response proxyResponse, byte[] buffer, int offset, int length, Callback callback)
    {
        try
        {
//            if (_log.isDebugEnabled())
//                _log.debug("{} proxying content to downstream: {} bytes", getRequestId(request), length);
            response.getOutputStream().write(buffer, offset, length);
            callback.succeeded();
        }
        catch (Throwable x)
        {
            callback.failed(x);
        }
    }
    
    protected void sendProxyRequest(HttpServletRequest clientRequest, HttpServletResponse proxyResponse, Request proxyRequest)
    {
//        if (_log.isDebugEnabled())
//        {
//            StringBuilder builder = new StringBuilder(clientRequest.getMethod());
//            builder.append(" ").append(clientRequest.getRequestURI());
//            String query = clientRequest.getQueryString();
//            if (query != null)
//                builder.append("?").append(query);
//            builder.append(" ").append(clientRequest.getProtocol()).append(System.lineSeparator());
//            for (Enumeration<String> headerNames = clientRequest.getHeaderNames(); headerNames.hasMoreElements();)
//            {
//                String headerName = headerNames.nextElement();
//                builder.append(headerName).append(": ");
//                for (Enumeration<String> headerValues = clientRequest.getHeaders(headerName); headerValues.hasMoreElements();)
//                {
//                    String headerValue = headerValues.nextElement();
//                    if (headerValue != null)
//                        builder.append(headerValue);
//                    if (headerValues.hasMoreElements())
//                        builder.append(",");
//                }
//                builder.append(System.lineSeparator());
//            }
//            builder.append(System.lineSeparator());
//
//            _log.debug("{} proxying to upstream:{}{}{}{}{}",
//                    getRequestId(clientRequest),
//                    System.lineSeparator(),
//                    builder,
//                    proxyRequest,
//                    System.lineSeparator(),
//                    proxyRequest.getHeaders().toString().trim());
//        }

        proxyRequest.send(newProxyResponseListener(clientRequest, proxyResponse));
    }
    
    protected Response.Listener newProxyResponseListener(HttpServletRequest request, HttpServletResponse response)
    {
        return new ProxyResponseListener(request, response);
    }
    
    protected boolean hasContent(HttpServletRequest clientRequest)
    {
        return clientRequest.getContentLength() > 0 ||
                clientRequest.getContentType() != null ||
                clientRequest.getHeader(HttpHeader.TRANSFER_ENCODING.asString()) != null;
    }
    
    protected void addProxyHeaders(HttpServletRequest clientRequest, Request proxyRequest)
    {
        addViaHeader(proxyRequest);
        addXForwardedHeaders(clientRequest, proxyRequest);
    }

    protected void addViaHeader(Request proxyRequest)
    {
        proxyRequest.header(HttpHeader.VIA, "http/1.1 " + _viaHost);
    }

    protected void addXForwardedHeaders(HttpServletRequest clientRequest, Request proxyRequest)
    {
        proxyRequest.header(HttpHeader.X_FORWARDED_FOR, clientRequest.getRemoteAddr());
        proxyRequest.header(HttpHeader.X_FORWARDED_PROTO, clientRequest.getScheme());
        proxyRequest.header(HttpHeader.X_FORWARDED_HOST, clientRequest.getHeader(HttpHeader.HOST.asString()));
        proxyRequest.header(HttpHeader.X_FORWARDED_SERVER, clientRequest.getLocalName());
    }
    
    protected class ProxyResponseListener extends Response.Listener.Adapter
    {
        private final HttpServletRequest request;
        private final HttpServletResponse response;

        protected ProxyResponseListener(HttpServletRequest request, HttpServletResponse response)
        {
            this.request = request;
            this.response = response;
        }

        @Override
        public void onBegin(Response proxyResponse)
        {
            response.setStatus(proxyResponse.getStatus());
        }

        @Override
        public void onHeaders(Response proxyResponse)
        {
            onServerResponseHeaders(request, response, proxyResponse);
        }

        @Override
        public void onContent(final Response proxyResponse, ByteBuffer content, final Callback callback)
        {
            byte[] buffer;
            int offset;
            int length = content.remaining();
            if (content.hasArray())
            {
                buffer = content.array();
                offset = content.arrayOffset();
            }
            else
            {
                buffer = new byte[length];
                content.get(buffer);
                offset = 0;
            }

            onResponseContent(request, response, proxyResponse, buffer, offset, length, new Callback.Nested(callback)
            {
                @Override
                public void failed(Throwable x)
                {
                    super.failed(x);
                    proxyResponse.abort(x);
                }
            });
        }

        @Override
        public void onComplete(Result result)
        {
            if (result.isSucceeded())
                onProxyResponseSuccess(request, response, result.getResponse());
            else
                onProxyResponseFailure(request, response, result.getResponse(), result.getFailure());
//            if (_log.isDebugEnabled())
//                _log.debug("{} proxying complete", getRequestId(request));
        }
    }
    
    protected class ProxyInputStreamContentProvider extends InputStreamContentProvider
    {
        private final HttpServletResponse response;
        private final Request proxyRequest;
        private final HttpServletRequest request;

        protected ProxyInputStreamContentProvider(HttpServletRequest request, HttpServletResponse response, Request proxyRequest, InputStream input)
        {
            super(input);
            this.request = request;
            this.response = response;
            this.proxyRequest = proxyRequest;
        }

        @Override
        public long getLength()
        {
            return request.getContentLength();
        }

        @Override
        protected ByteBuffer onRead(byte[] buffer, int offset, int length)
        {
//            if (_log.isDebugEnabled())
//                _log.debug("{} proxying content to upstream: {} bytes", getRequestId(request), length);
            return onRequestContent(request, proxyRequest, buffer, offset, length);
        }

        protected ByteBuffer onRequestContent(HttpServletRequest request, Request proxyRequest, byte[] buffer, int offset, int length)
        {
            return super.onRead(buffer, offset, length);
        }

        @Override
        protected void onReadFailure(Throwable failure)
        {
            onClientRequestFailure(request, proxyRequest, response, failure);
        }
    }
    
    private class DelegatingContentProvider extends IteratingCallback implements AsyncContentProvider.Listener
    {
        private final HttpServletRequest clientRequest;
        private final Request proxyRequest;
        private final HttpServletResponse proxyResponse;
        private final Iterator<ByteBuffer> iterator;
        private final DeferredContentProvider deferred;

        private DelegatingContentProvider(HttpServletRequest clientRequest, Request proxyRequest, HttpServletResponse proxyResponse, ContentProvider provider, DeferredContentProvider deferred)
        {
            this.clientRequest = clientRequest;
            this.proxyRequest = proxyRequest;
            this.proxyResponse = proxyResponse;
            this.iterator = provider.iterator();
            this.deferred = deferred;
            if (provider instanceof AsyncContentProvider)
                ((AsyncContentProvider)provider).setListener(this);
        }

        @Override
        protected Action process() throws Exception
        {
            if (!iterator.hasNext())
                return Action.SUCCEEDED;

            ByteBuffer buffer = iterator.next();
            if (buffer == null)
                return Action.IDLE;

            deferred.offer(buffer, this);
            return Action.SCHEDULED;
        }

        @Override
        public void succeeded()
        {
            if (iterator instanceof Callback)
                ((Callback)iterator).succeeded();
            super.succeeded();
        }

        @Override
        protected void onCompleteSuccess()
        {
            try
            {
                if (iterator instanceof Closeable)
                    ((Closeable)iterator).close();
                deferred.close();
            }
            catch (Throwable x)
            {
//                _log.ignore(x);
            }
        }

        @Override
        protected void onCompleteFailure(Throwable failure)
        {
            if (iterator instanceof Callback)
                ((Callback)iterator).failed(failure);
            onClientRequestFailure(clientRequest, proxyRequest, proxyResponse, failure);
        }

        @Override
        public InvocationType getInvocationType()
        {
            return InvocationType.NON_BLOCKING;
        }

        @Override
        public void onContent()
        {
            iterate();
        }
    }
    
    class ProxyContinueProtocolHandler extends ContinueProtocolHandler
    {
        @Override
        protected void onContinue(Request request)
        {
            HttpServletRequest clientRequest = (HttpServletRequest)request.getAttributes().get(CLIENT_REQUEST_ATTRIBUTE);
            CustomProxy.this.onContinue(clientRequest, request);
        }
    }
}
