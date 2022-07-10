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

public class AuthorizationServiceHandler extends BaseHandler
{
  protected Authorizator authorizator;
  
  public void construct(Obj args) throws Exception
  {
    super.construct(args);
    
    this.authorizator = m.Global.objects.get(Authorizator.class, args.get(Conf.AUTHZ));
    
    if(this.authorizator == null)
    {
      throw new Exception();
    }
  }
  
  public void destruct() throws Exception
  {
    super.destruct();
    
    if(authorizator != null)
    {
      if(authorizator instanceof ConfigurableObject)
      {
        ((ConfigurableObject) authorizator).destruct();
      }
      
      authorizator = null;
    }
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
    
    AuthorizatorSession session = getSession(request, response);
    
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
  
  protected AuthorizatorSession getSession(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    Cookie sessionCookie = getSessionCookie(request);
    
    AuthorizatorSession session = sessionCookie == null ? null : authorizator.session(sessionCookie.getValue());
    
    if(session == null)
    {
      session = authorizator.createSession();
      
      setSessionCookie(request, response, session.id());
    }
    
    m.Global.log.debug(request.getRequestURI(), request.getMethod(), session.id(), request.getHeader("Cookie"));
    
    return session;
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
}
