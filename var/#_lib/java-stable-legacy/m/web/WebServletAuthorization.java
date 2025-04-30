package m.web;

import java.net.*;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

// todo decide if authorizator is fixed at construction or if can be dynamically accessed by iface-default or by name specified at construction
public class WebServletAuthorization extends WebServlet
{
  private Authorizator authorizator;
  
  public WebServletAuthorization(Authorizator authorizator) throws Exception
  {
    if(authorizator == null)
    {
      throw new Exception();
    }
    
    this.authorizator = authorizator;
  }
  
  public void exec(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    try
    {
      execute(request, response);
    }
    catch(Exception e)
    {
      executionError(e, request, response);
    }
  }
  
  protected void execute(HttpServletRequest request, HttpServletResponse response) throws Exception
  {
    String command = request.getServletPath().substring(1);
//    if(command == null)
//    {
//      command = "";
//    }
    
    String pathInfo = request.getPathInfo();
    if(pathInfo != null)
    {
      command += pathInfo;
    }
    command = URLDecoder.decode(command, m.enc.Encoding.UTF_8);
    
//    m.Global.log.debug(request.getRequestURI(), command);
    
    WebObjInput in = new WebObjInput(request);
    WebObjOutput out = new WebObjOutput(response);
    
    m.Global.log.debug(request.getRequestURI(), command, in.map().keySet());
    
    AuthorizationSession session = getSession(request);
    
    session.setAttribute("timestamp/access", "" + System.currentTimeMillis());
    session.setAttribute("time/interval", "" + (System.currentTimeMillis() - request.getSession().getLastAccessedTime()));
    session.setAttribute("ip/request", request.getRemoteAddr());
    
    // only for activating session state-triggers, not for request authorization (WebObjInput will provide those attributes as request input)
    session.setAttribute("request/ip", request.getRemoteAddr());
//session.setAttribute("request/ip", "192.0.0.0");
//session.setAttribute("request/ip", "192.168.1.1");
//session.setAttribute("request/ip", "172.16.5.1");
session.setAttribute("request/ip", "93.145.197.90");
    session.setAttribute("request/size", "" + request.getContentLengthLong());
    session.setAttribute("request/type", request.getContentType());
    session.setAttribute("request/dispatcher", request.getDispatcherType().toString());
    session.setAttribute("request/agent", request.getHeader("User-Agent"));
    
    // not for direct request authorization, but for global user counter that may trigger session events and thus authorizations
    // eg count number of requests from ip (hammering) to give temporary stop
    session.setAttribute("request/command", command);
    
    // todo add all request headers, cookies and any other request info available (request params included (except file contents)!!!) to allow complete profiling
    
    // todo a way to set all those attributes without profiler to log at each one but at end and then log for any internal update
//    m.Global.log.debug(request.getRequestURI(), sessionID, httpSession.isNew(), session.profiler().profileStack(), session.profiler().profiles(), session.profiler().authorizations().keySet(), session.profiler().configurations().keySet(), session.profiler().authorization());
    
    if(session.execute(command, in, out))
    {
      executionGrantedAndCompleted(command, out);
    }
    else
    {
      executionDenied(command, out);
    }
  }
  
  protected AuthorizationSession getSession(HttpServletRequest request) throws Exception
  {
    HttpSession httpSession = request.getSession();
    String sessionID = httpSession.getId();
    if(httpSession.isNew())
    {
//      httpSession.setMaxInactiveInterval(0);
      httpSession.setMaxInactiveInterval(86400);
    }
    
//    m.Global.log.debug(request.getRequestURI(), sessionID, httpSession.isNew());
    
    AuthorizationSession session = authorizator.session(sessionID);
    if(session == null)
    {
//      m.Global.log.debug(sessionID, null);
      session = authorizator.createSession(sessionID);
      
      session.setAttribute("session/id", sessionID);
      session.setAttribute("session/ip", request.getRemoteAddr());
      session.setAttribute("session/time/creation", "" + httpSession.getCreationTime());
    }
    
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
