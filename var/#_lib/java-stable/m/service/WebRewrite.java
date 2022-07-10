package m.service;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class WebRewrite implements AuthorizedService, ConfigurableObject
{
  protected PrefixMap<String> rewriteRules;
  protected boolean redirect;
  
  public void configure(Obj params) throws Exception
  {
//    Boolean redirectObject = params.bool(Conf.REDIRECT);
//    redirect = redirectObject == null ? false : redirectObject;
//    
//    rewriteRules.clear();
//    rewriteRules.putAll(params.map(Conf.REWRITE));
  }
  
  public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    HttpServletResponse response = ((m.web.WebObjOutput) out).getHttpServletResponse();
    
    String rewrittenURL = rewriteRules.prefixKey(command);
    
    m.Global.log.debug(command, rewriteRules, redirect, rewrittenURL);
    
    if(redirect == true)
    {
      response.sendRedirect(rewrittenURL);
    }
    else
    {
      if(rewrittenURL.startsWith("/"))
      {
        rewrittenURL = rewrittenURL.substring(1);
      }
      
      session.execute(rewrittenURL, in, out);
    }
  }
}
