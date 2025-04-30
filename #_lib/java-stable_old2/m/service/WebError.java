package m.service;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class WebError implements AuthorizedStatelessService, ConfigurableObject
{
  protected int errorCode;
  
  public void configure(Obj params) throws Exception
  {
    Long errorObject = params.integer(Conf.ERROR);
    errorCode = errorObject == null ? 500 : errorObject.intValue();
  }
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    m.Global.log.debug(command, errorCode);
    
    HttpServletResponse response = ((m.web.WebObjOutput) out).getHttpServletResponse();
    
    response.setStatus(errorCode);
  }
}
