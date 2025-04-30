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

public class ServiceMapHandler extends AbstractHandler implements ConfigurableObject
{
  protected boolean secureRedirect;
  protected PrefixMap<AuthorizedStatelessService> services;
//  protected AuthorizationSession session = null;
  
  public void construct(Obj args) throws Exception
  {
//    session = new BaseAuthorizationSession(null, null, "shared-fake-session-id");
    
    construct(args.bool(Conf.SECURE), args.get(Conf.SERVICES));
  }
  
  public void construct() throws Exception
  {
    construct(null, null);
  }
  
  public void construct(Boolean secureRedirect, Obj services) throws Exception
  {
    destruct();
    
    this.secureRedirect = secureRedirect == null ? false : secureRedirect;
    this.services = new PrefixMap<>();
    
    if(services != null)
    {
      ConfigurableMap<AuthorizedStatelessService> map = new ConfigurableMap<AuthorizedStatelessService>();
      map.construct(null);
      map.configure(services);
      this.services = map.get();
    }
  }
  
  public void destruct() throws Exception
  {
    if(services != null)
    {
      services.clear();
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
          response.sendError(HttpStatus.FORBIDDEN_403, "No http configuration available");
          
          return;
        }
        
        if(0 < httpConfig.getSecurePort())
        {
          String scheme = httpConfig.getSecureScheme();
          int port = httpConfig.getSecurePort();

          String url = URIUtil.newURI(scheme, baseRequest.getServerName(), port, baseRequest.getRequestURI(), baseRequest.getQueryString());
          response.setContentLength(0);
          response.sendRedirect(url);
        }
        else
        {
          response.sendError(HttpStatus.FORBIDDEN_403, "Not Secure");
        }
      }
    }
    catch(Exception e)
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
    
    AuthorizedStatelessService srv = services.prefix(command);
    if(srv == null)
    {
      throw new Exception();
    }
    
    String serviceKey = services.prefixKey(command);
    String cmd = command.substring(serviceKey.length());
    
    m.Global.log.debug(command, serviceKey, cmd, srv.getClass().getName());
    
    WebObjInput in = new WebObjInput(request);
    WebObjOutput out = new WebObjOutput(response);
    srv.execute(cmd, in, out);
  }
  
  protected void executionError(Exception e, HttpServletRequest request, HttpServletResponse response) throws Exception
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
