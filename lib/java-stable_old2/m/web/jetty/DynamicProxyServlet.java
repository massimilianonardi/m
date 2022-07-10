package m.web.jetty;

import javax.servlet.http.*;

import org.eclipse.jetty.client.*;
import org.eclipse.jetty.util.ssl.*;
import org.eclipse.jetty.proxy.*;

public class DynamicProxyServlet extends ProxyServlet
{
  final static public String REVERSE_PROXY_ATTRIBUTE = "reverse-proxy.forward-to-url";
  
  protected HttpClient newHttpClient()
  {
    SslContextFactory sslContextFactory = new SslContextFactory();
    sslContextFactory.setTrustAll(true);
    
    return new HttpClient(sslContextFactory);
  }
  
  protected String rewriteTarget(HttpServletRequest request)
  {
    String urlString = (String) request.getAttribute(REVERSE_PROXY_ATTRIBUTE);
    
    m.Global.log.debug(urlString);
    
    return urlString;
  }
}
