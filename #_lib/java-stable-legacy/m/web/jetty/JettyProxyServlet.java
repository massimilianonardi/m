package m.web.jetty;

import java.net.*;
import javax.servlet.http.*;

import org.eclipse.jetty.client.*;
import org.eclipse.jetty.util.ssl.*;

import org.eclipse.jetty.proxy.*;

public class JettyProxyServlet extends ProxyServlet
{
  protected HttpClient newHttpClient()
  {
    SslContextFactory sslContextFactory = new SslContextFactory();
    sslContextFactory.setTrustAll(true);
    
    return new HttpClient(sslContextFactory);
  }
  
  protected String rewriteTarget(HttpServletRequest request)
  {
    String urlString = "";
    
    if(request.getServletPath() != null)
    {
      urlString += request.getServletPath();
    }
    
    if(request.getQueryString() != null)
    {
      urlString += "?" + request.getQueryString();
    }
    
    if(0 < urlString.length() && urlString.charAt(0) == '/')
    {
      urlString = urlString.substring(1);
    }
    
    if(-1 == urlString.indexOf("://"))
    {
      urlString = "http://" + urlString;
    }
    
//    try
//    {
//      URL url= new URL(urlString);
//      URI uri = new URI(url.getProtocol(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), url.getQuery(), url.getRef());
//      urlString = uri.toString();
//    }
//    catch(Exception e)
//    {
//      e.printStackTrace();
//    }
    
    m.Global.log.debug(urlString);
    
    return urlString;
  }
}
