package m.web.jetty;

import java.io.*;
import java.net.*;
import java.util.*;

import javax.servlet.*;
import javax.servlet.http.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.*;
import org.eclipse.jetty.http.*;
import org.eclipse.jetty.util.*;

import m.object.*;
import m.conf.*;
import m.service.*;
import m.auth.*;
import m.web.*;

public class AuthorizationServiceHandler extends AbstractHandler implements ConfigurableObject
{
  final static public String DEFAULT_SESSION_COOKIE_NAME = "MSESSIONID";
  final static public String MULTIPART_CONFIG_ELEMENT = "org.eclipse.jetty.multipartConfig";
  
  protected String sessionCookieName;
  protected boolean secureCookie;
  protected boolean secureRedirect;
  protected Authorizator authorizator;
  
  protected MultipartConfigElement multipartConfigElement = new MultipartConfigElement("", -1, -1, 0);
  
  public void construct(Obj args) throws Exception
  {
    construct(args.bool(Conf.SECURE), args.bool(Conf.REDIRECT), args.string(Conf.COOKIE), m.Global.objects.get(Authorizator.class, args.get(Conf.AUTHZ)));
  }
  
  public void construct() throws Exception
  {
    construct(null, null, null, null);
  }
  
  public void construct(Boolean secureCookie, Boolean secureRedirect, String sessionCookieName, Authorizator authorizator) throws Exception
  {
    destruct();
    
    this.secureCookie = secureCookie == null ? false : secureCookie;
    this.secureRedirect = secureRedirect == null ? false : secureRedirect;
    this.sessionCookieName = sessionCookieName == null ? DEFAULT_SESSION_COOKIE_NAME : sessionCookieName;
    this.authorizator = authorizator == null ? m.Global.authorizator : authorizator;
    
    if(this.authorizator == null)
    {
      throw new Exception();
    }
  }
  
  public void destruct() throws Exception
  {
    if(authorizator != null)
    {
      if(authorizator instanceof ConfigurableObject)
      {
        ((ConfigurableObject) authorizator).destruct();
      }
      
      authorizator = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    configure();
  }
  
  public void configure() throws Exception
  {
//    destruct();
    
    m.Global.log.debug("JETTY EMBEDDED SERVER/SERVICE CONFIGURE: TODO CUSTOM PARAMETERS");
  }
  
  public void handle(String target, Request baseRequest, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
  {
    if(baseRequest.isHandled() == true)
    {
      return;
    }
    
    try
    {
      HttpChannel httpChannel = baseRequest.getHttpChannel();
      
      if(secureRedirect == false || baseRequest.isSecure() || httpChannel == null)
      {
        execute(request, response);
      }
      else
      {
        HttpConfiguration httpConfig = httpChannel.getHttpConfiguration();
        if(httpConfig == null)
        {
          // no config, show error
          m.Global.log.error(HttpStatus.FORBIDDEN_403, "No http configuration available");
          response.sendError(HttpStatus.FORBIDDEN_403, "No http configuration available");
          
          return;
        }
        
        if(0 < httpConfig.getSecurePort())
        {
          String scheme = httpConfig.getSecureScheme();
          int port = httpConfig.getSecurePort();

          m.Global.log.info(scheme, baseRequest.getServerName(), port, baseRequest.getRequestURI(), baseRequest.getQueryString());
          String url = URIUtil.newURI(scheme, baseRequest.getServerName(), port, baseRequest.getRequestURI(), baseRequest.getQueryString());
          response.setContentLength(0);
          response.sendRedirect(url);
        }
        else
        {
          m.Global.log.error(HttpStatus.FORBIDDEN_403, "Not Secure");
          response.sendError(HttpStatus.FORBIDDEN_403, "Not Secure");
        }
      }
    }
    catch(Throwable e)
    {
      try
      {
        executionError(e, request, response);
      }
      catch(Exception ex)
      {
        ex.printStackTrace();
        e.printStackTrace();
      }
    }
    
    baseRequest.setHandled(true);
  }
  
  protected void execute(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    String command = request.getServletPath();
    
    String pathInfo = request.getPathInfo();
    if(pathInfo != null)
    {
      command += pathInfo;
    }
    command = command.substring(1);
    command = URLDecoder.decode(command, m.enc.Encoding.UTF_8);
    
    request.setAttribute(MULTIPART_CONFIG_ELEMENT, multipartConfigElement);
    WebObjInput in = new WebObjInput(request);
    WebObjOutput out = new WebObjOutput(response);
    
    m.Global.log.debug(request.getRequestURI(), command, in.map().keySet());
    
    AuthorizationSession session = getSession(request, response);
    
    String previousSessionID = session.id();
    
    if(session.execute(command, in, out))
    {
      executionGrantedAndCompleted(command, out);
    }
    else
    {
      executionDenied(command, out);
    }
    
    String currentSessionID = session.id();
    
    if(!previousSessionID.equals(currentSessionID))
    {
      m.Global.log.debug(previousSessionID, currentSessionID);
      
      setSessionCookie(request, response, currentSessionID);
    }
  }
  
  protected AuthorizationSession getSession(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    Cookie sessionCookie = getSessionCookie(request);
    
    AuthorizationSession session = sessionCookie == null ? null : authorizator.session(sessionCookie.getValue());
    
    if(session == null)
    {
      session = authorizator.createSession();
      
      session.setAttribute("session/id", session.id());
      session.setAttribute("session/ip", request.getRemoteAddr());
      session.setAttribute("session/time/creation", "" + System.currentTimeMillis());
      
      setSessionCookie(request, response, session.id());
    }
    
    session.setAttribute("timestamp/access", "" + System.currentTimeMillis());
//    session.setAttribute("time/interval", "" + (System.currentTimeMillis() - request.getSession().getLastAccessedTime()));
    session.setAttribute("ip/request", request.getRemoteAddr());
    
    // only for activating session state-triggers, not for request authorization (WebObjInput will provide those attributes as request input)
////session.setAttribute("request/ip", "192.0.0.0");
////session.setAttribute("request/ip", "192.168.1.1");
////session.setAttribute("request/ip", "172.16.5.1");
////session.setAttribute("request/ip", "93.145.197.90");
//    session.setAttribute("request/ip", request.getRemoteAddr());
//    session.setAttribute("request/size", "" + request.getContentLengthLong());
//    session.setAttribute("request/type", request.getContentType());
//    session.setAttribute("request/dispatcher", request.getDispatcherType().toString());
//    session.setAttribute("request/agent", request.getHeader("User-Agent"));
    
    // not for direct request authorization, but for global user counter that may trigger session events and thus authorizations
    // eg count number of requests from ip (hammering) to give temporary stop
//    session.setAttribute("request/command", command);
    
    // todo add all request headers, cookies and any other request info available (request params included (except file contents)!!!) to allow complete profiling
    
    // todo a way to set all those attributes without profiler to log at each one but at end and then log for any internal update
//    m.Global.log.debug(request.getRequestURI(), sessionID, httpSession.isNew(), session.profiler().profileStack(), session.profiler().profiles(), session.profiler().authorizations().keySet(), session.profiler().configurations().keySet(), session.profiler().authorization());
    
    m.Global.log.debug(request.getRequestURI(), request.getMethod(), session.id(), request.getHeader("Cookie"));
    
    return session;
  }
  
  protected Cookie getSessionCookie(HttpServletRequest request) throws Exception
  {
    Cookie sessionCookie = null;
    
    Cookie[] cookies = request.getCookies();
    if(cookies != null && 0 < cookies.length)
    {
      for(int i = 0; i < cookies.length; i++)
      {
        if(sessionCookieName.equals(cookies[i].getName()))
        {
          sessionCookie = cookies[i];
//          m.Global.log.debug(request.getRemoteHost(), request.getRemoteAddr(), "name: " + sessionCookie.getName() + " - value: " + sessionCookie.getValue() + " - domain: " + sessionCookie.getDomain() + " - path: " + sessionCookie.getPath() + " - http only: " + sessionCookie.isHttpOnly() + " - secure: " + sessionCookie.getSecure() + " - max age: " + sessionCookie.getMaxAge()+ " - comment: " + sessionCookie.getComment()+ " - version: " + sessionCookie.getVersion());
          break;
        }
      }
    }
    
    return sessionCookie;
  }
  
  protected void setSessionCookie(HttpServletRequest request, HttpServletResponse response, String sessionID) throws Exception
  {
    Cookie sessionCookie = new Cookie(sessionCookieName, sessionID);
    sessionCookie.setHttpOnly(true);
    if(secureCookie)
    {
      sessionCookie.setSecure(true);
      sessionCookie.setDomain(request.getRemoteHost());
    }
//    sessionCookie.setDomain(request.getRemoteHost());
    sessionCookie.setPath("/");
//System.out.println("m.web.jetty.AuthorizationServiceHandler.setSessionCookie()" + "name: " + sessionCookie.getName() + " - value: " + sessionCookie.getValue() + " - domain: " + sessionCookie.getDomain() + " - path: " + sessionCookie.getPath() + " - http only: " + sessionCookie.isHttpOnly() + " - secure: " + sessionCookie.getSecure() + " - max age: " + sessionCookie.getMaxAge()+ " - comment: " + sessionCookie.getComment()+ " - version: " + sessionCookie.getVersion());

    response.addCookie(sessionCookie);
    
    m.Global.log.debug(sessionID);
//    m.Global.log.debug(sessionID, request.getRemoteHost(), request.getRemoteAddr(), "name: " + sessionCookie.getName() + " - value: " + sessionCookie.getValue() + " - domain: " + sessionCookie.getDomain() + " - path: " + sessionCookie.getPath() + " - http only: " + sessionCookie.isHttpOnly() + " - secure: " + sessionCookie.getSecure() + " - max age: " + sessionCookie.getMaxAge()+ " - comment: " + sessionCookie.getComment()+ " - version: " + sessionCookie.getVersion());
  }
  
  protected void executionGrantedAndCompleted(String command, WebObjOutput out) throws Exception
  {
    out.close();
    m.Global.log.debug(command);
  }
  
  protected void executionDenied(String command, WebObjOutput out) throws Exception
  {
    m.Global.log.debug(command);
    out.response.setStatus(HttpServletResponse.SC_FORBIDDEN);
  }
  
  protected void executionError(Throwable e, HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    java.util.List<String> stackTrace = new java.util.ArrayList();
    for(StackTraceElement k: e.getStackTrace())
    {
      stackTrace.add(k.getClassLoaderName() + "/" + k.getClassName() + "." + k.getMethodName()+ ":" + k.getLineNumber());
    }
    
    m.Global.log.error(request.getRequestURI(), e.toString(), stackTrace);
    
    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
  }
}
