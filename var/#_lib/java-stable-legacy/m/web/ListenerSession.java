package m.web;

import javax.servlet.http.*;

import m.auth.*;

public class ListenerSession implements HttpSessionListener
{
  public void sessionCreated(HttpSessionEvent event)
  {
    HttpSession httpSession = event.getSession();
    
    // todo set inactive from conf
    httpSession.setMaxInactiveInterval(500);
    
    m.Global.log.debug(httpSession.getId(), httpSession.isNew(), httpSession.getCreationTime(), httpSession.getLastAccessedTime(), httpSession.getMaxInactiveInterval(), httpSession.getAttributeNames());
  }
  
  public void sessionDestroyed(HttpSessionEvent event)
  {
    HttpSession httpSession = event.getSession();
    
    m.Global.log.debug(httpSession.getId(), httpSession.isNew(), httpSession.getCreationTime(), httpSession.getLastAccessedTime(), httpSession.getMaxInactiveInterval(), httpSession.getAttributeNames());
    
    try
    {
      String sessionID = httpSession.getId();
      AuthorizationSession session = m.Global.authorizator.session(sessionID);
      m.Global.log.debug(sessionID, session != null);
      if(session != null)
      {
        m.Global.authorizator.destroySession(sessionID);
      }
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
}
