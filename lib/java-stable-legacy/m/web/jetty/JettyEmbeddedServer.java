package m.web.jetty;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.*;
import org.eclipse.jetty.xml.*;
import org.eclipse.jetty.util.log.*;
import org.eclipse.jetty.util.ssl.*;
import org.eclipse.jetty.webapp.*;
import org.eclipse.jetty.servlet.*;

import m.object.*;
import m.conf.*;
//import m.service.*;

public class JettyEmbeddedServer implements ConfigurableObject, m.service.Server
{
  protected Server server;
  
  public void construct(Obj args) throws Exception
  {
    construct(args.string(Conf.HOST), args.integer(Conf.PORT).intValue(), args.bool(Conf.SECURE), (Handler) m.Global.objects.get(args.get(Conf.HANDLER)));
  }
  
  protected ServerConnector constructServerConnectorHTTP(String host, int port, int securePort) throws Exception
  {
    HttpConfiguration httpConf = new HttpConfiguration();
    httpConf.setSendServerVersion(false);
    httpConf.setSecureScheme("https");
    httpConf.setSecurePort(securePort);
    
    HttpConnectionFactory httpConnectionFactory = new HttpConnectionFactory(httpConf);
    
    ServerConnector httpConnector = new ServerConnector(server, httpConnectionFactory);
    httpConnector.setName("http");
    httpConnector.setHost(host);
    httpConnector.setPort(port);
    
    return httpConnector;
  }
  
  protected ServerConnector constructServerConnectorHTTPS(String host, int port) throws Exception
  {
    HttpConfiguration httpsConf = new HttpConfiguration();
    httpsConf.setSendServerVersion(false);
    httpsConf.setSecureScheme("https");
    httpsConf.setSecurePort(port);
    httpsConf.addCustomizer(new SecureRequestCustomizer(true, -1, false));
    
    HttpConnectionFactory httpsConnectionFactory = new HttpConnectionFactory(httpsConf);
    
    SslContextFactory sslContextFactory = new SslContextFactory();
    sslContextFactory.setKeyManagerPassword("123456");
    sslContextFactory.setKeyStoreType("JKS");
    sslContextFactory.setKeyStorePath("conf/keystore");
    sslContextFactory.setKeyStorePassword("123456");
    sslContextFactory.setTrustStoreType(System.getProperty("jetty.sslContext.trustStoreType"));
    sslContextFactory.setTrustStorePath("conf/keystore");
    sslContextFactory.setTrustStorePassword("123456");
    sslContextFactory.addExcludeProtocols("SSL", "SSLv2", "SSLv2Hello", "SSLv3", "TLSv1");
    
    SslConnectionFactory sslConnectionFactory = new SslConnectionFactory(sslContextFactory, "http/1.1");
    
    ServerConnector httpsConnector = new ServerConnector(server, sslConnectionFactory, httpsConnectionFactory);
    httpsConnector.setName("https");
    httpsConnector.setHost(host);
    httpsConnector.setPort(port);
    
    return httpsConnector;
  }
  
  public void construct(String host, int port, boolean secure, Handler handler) throws Exception
  {
    destruct();
    
    org.eclipse.jetty.util.log.Log.setLog(new JettyLoggerNoLog());
    
    if(secure)
    {
//      server = constructSecure(host, port);
    }
    else
    {
//      server = constructUnsecure(host, port);
    }
    
    server = new Server();
    HandlerCollection handlerCollection = new HandlerCollection();
    server.setHandler(handlerCollection);
    
    
    SecuredRedirectHandler securedRedirectHandler = new SecuredRedirectHandler();
    ContextHandler contextHandler = new ContextHandler();
    contextHandler.setHandler(securedRedirectHandler);
    contextHandler.setVirtualHosts(new String[]{"@http"});
    
    handlerCollection.addHandler(contextHandler);
    
    
    WebAppContext webAppContext = new WebAppContext();
    webAppContext.setParentLoaderPriority(true);
    webAppContext.setVirtualHosts(new String[]{"@https"});
    webAppContext.setContextPath("/");
    webAppContext.setResourceBase("tmp_wac_resource_base");
    
    HttpServlet servlet = new m.web.WebServletAuthorization(m.Global.authorizator);
    ServletHolder servletHolder = new ServletHolder(servlet);
    servletHolder.getRegistration().setMultipartConfig(new MultipartConfigElement("", -1, -1, 0));
    webAppContext.addServlet(servletHolder, "/");
    webAppContext.setWelcomeFiles(new String[]{""});
    
    handlerCollection.addHandler(webAppContext);
    
    start();
  }
  
  public void destruct() throws Exception
  {
    if(server != null)
    {
      server.stop();
      server.destroy();
      server = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    configure(params.integer(Conf.PORT).intValue(), (Handler) m.Global.objects.get(params.get(Conf.HANDLER)), params.string(Conf.XML));
  }
  
  public void configure(int port, Handler handler, String xmlPath) throws Exception
  {
    destruct();
  }
  
  public void start() throws Exception
  {
    server.start();
    server.dumpStdErr();
//    server.join();
  }
  
  public void stop() throws Exception
  {
    server.stop();
  }
  
  public boolean isRunning() throws Exception
  {
    return server.isRunning();
  }
}
