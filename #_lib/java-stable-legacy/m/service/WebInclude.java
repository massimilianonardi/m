package m.service;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class WebInclude implements AuthorizedService, ConfigurableObject
{
  protected String webapp;
  protected String url;
  protected boolean append;
  
  public void configure(Obj params) throws Exception
  {
    webapp = params.string(Conf.WEBAPP);
    url = params.string(Conf.URL);
    Boolean appendObject = params.bool(Conf.APPEND);
    append = appendObject == null ? false : appendObject;
  }
  
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    HttpServletRequest request = ((m.web.WebObjInput) in).getHttpServletRequest();
    HttpServletResponse response = ((m.web.WebObjOutput) out).getHttpServletResponse();
    
    String includeURL = url == null ? "" : url;
    
    if(append && command != null && !"".equals(command))
    {
      includeURL += "/" + command;
    }
    
    m.Global.log.debug(command, webapp, url, append, includeURL);
    
    if(webapp != null)
    {
      request.getServletContext().getContext("/" + webapp).getRequestDispatcher(includeURL).forward(request, response);
    }
    else
    {
      request.getServletContext().getRequestDispatcher(includeURL).forward(request, response);
    }
//    dispatcher.include(request, response);
  }
}
