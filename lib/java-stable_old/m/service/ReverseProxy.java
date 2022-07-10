package m.service;

import javax.servlet.http.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.web.*;
import m.web.jetty.*;

public class ReverseProxy implements AuthorizedStatelessService, ConfigurableObject
{
  protected String url;
  protected String prefix;
  
  protected JettyAbstractProxyServlet reverseProxy;
  
  public void construct(Obj args) throws Exception
  {
    reverseProxy = new JettyAbstractProxyServlet();
    reverseProxy.construct(args);
  }
  
  public void configure(Obj params) throws Exception
  {
    url = params.string(Conf.URL);
    prefix = params.string(Conf.PREFIX);
    
    if(prefix == null)
    {
      prefix = "";
    }
  }
  
  public void execute(String command, ObjInput in, ObjOutput out) throws Exception
  {
    HttpServletRequest request = ((WebObjInput) in).getHttpServletRequest();
    HttpServletResponse response = ((WebObjOutput) out).getHttpServletResponse();
    
    String proxyURL = url;
    
    if(url == null || "".equals(url))
    {
      if(command == null || "".equals(command))
      {
        throw new Exception();
      }
      else
      {
//        proxyURL = command;
        proxyURL = "";
      }
    }
    
    m.Global.log.debug(request.getRequestURI(), command, prefix, proxyURL);
    
    reverseProxy.forwardTo(prefix, proxyURL, request, response);
  }
}
