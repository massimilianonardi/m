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

abstract public class BaseHandler extends AbstractHandler implements ConfigurableObject
{
  final static public String DEFAULT_SESSION_COOKIE_NAME = "MSESSIONID";
  final static public String MULTIPART_CONFIG_ELEMENT = "org.eclipse.jetty.multipartConfig";
  
  protected boolean secureRedirect;
  protected String redirectScheme;
  protected String redirectServer;
  protected Long redirectPort;
  protected String redirectPath;
  protected boolean secureCookie;
  protected String sessionCookieName;
  
  protected MultipartConfigElement multipartConfigElement = new MultipartConfigElement("", -1, -1, 0);
  
  public void construct(Obj args) throws Exception
  {
    construct(args.bool(Conf.REDIRECT), args.string(Conf.SCHEME), args.string(Conf.SERVER), args.integer(Conf.PORT), args.string(Conf.PATH), args.bool(Conf.SECURE), args.string(Conf.COOKIE));
  }
  
  public void construct() throws Exception
  {
    construct(null, null, null, null, null, null, null);
  }
  
  public void construct(Boolean secureRedirect, String redirectScheme, String redirectServer, Long redirectPort, String redirectPath, Boolean secureCookie, String sessionCookieName) throws Exception
  {
    destruct();
    
    this.secureRedirect = secureRedirect == null ? false : secureRedirect;
    this.redirectScheme = redirectScheme;
    this.redirectServer = redirectServer;
    this.redirectPort = redirectPort;
    this.redirectPath = redirectPath;
    this.secureCookie = secureCookie == null ? false : secureCookie;
    this.sessionCookieName = sessionCookieName == null ? DEFAULT_SESSION_COOKIE_NAME : sessionCookieName;
  }
  
  public void destruct() throws Exception
  {
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
      
      if(secureRedirect == false || baseRequest.isSecure() || httpChannel == null || (redirectServer != null && redirectPort != null && request.getServerName() == redirectServer && request.getServerPort() == redirectPort) || (redirectPort != null && request.getServerPort() == redirectPort))
      {
        execute(request, response);
      }
      else
      {
        String scheme = redirectScheme;
        String server = redirectServer == null ? baseRequest.getServerName() : redirectServer;
        Long port = redirectPort;
        String path = redirectPath == null ? baseRequest.getRequestURI() : redirectPath;
        String query = redirectPath == null ? baseRequest.getQueryString() : null;
        
        if(redirectScheme == null || redirectPort == null)
        {
          HttpConfiguration httpConfig = httpChannel.getHttpConfiguration();
          if(httpConfig == null)
          {
            // no config, show error
            m.Global.log.error(HttpStatus.FORBIDDEN_403, "No http configuration available");
            response.sendError(HttpStatus.FORBIDDEN_403, "No http configuration available");
            
            return;
          }
          
          if(scheme == null)
          {
            scheme = httpConfig.getSecureScheme();
            if(scheme == null)
            {
              scheme = baseRequest.getScheme();
            }
          }
          else
          {
            m.Global.log.error(HttpStatus.FORBIDDEN_403, "Not Secure");
            response.sendError(HttpStatus.FORBIDDEN_403, "Not Secure");
          }
          
          if(port == null && 0 < httpConfig.getSecurePort())
          {
            port = (long) httpConfig.getSecurePort();
          }
          else
          {
            m.Global.log.error(HttpStatus.FORBIDDEN_403, "Not Secure");
            response.sendError(HttpStatus.FORBIDDEN_403, "Not Secure");
          }
        }
        
        String url = URIUtil.newURI(scheme, server, port.intValue(), path, query);
        m.Global.log.info(baseRequest.getRequestURL().toString(), url);
        response.setContentLength(0);
        response.sendRedirect(url);
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
  
  abstract protected void execute(HttpServletRequest request, HttpServletResponse response) throws Exception;
  
  protected String getSessionID(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    Cookie sessionCookie = getSessionCookie(request);
    
    String sessionID = sessionCookie == null ? null : sessionCookie.getValue();
    
    m.Global.log.debug(request.getRequestURI(), request.getMethod(), sessionID, request.getHeader("Cookie"));
    
    return sessionID;
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
