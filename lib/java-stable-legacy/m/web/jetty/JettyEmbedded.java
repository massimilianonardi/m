package m.web.jetty;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.*;
import org.eclipse.jetty.xml.*;
import org.eclipse.jetty.util.log.*;
import org.eclipse.jetty.util.ssl.*;
import org.eclipse.jetty.webapp.*;
import org.eclipse.jetty.servlet.*;

import m.object.*;
import m.conf.*;
//import m.service.*;

public class JettyEmbedded implements ConfigurableObject, m.service.Server
{
  protected Server server;
  
  public void construct(Obj args) throws Exception
  {
    construct(args.string(Conf.HOST), args.integer(Conf.PORT).intValue(), args.integer(Conf.SECURE).intValue(), (Handler) m.Global.objects.get(args.get(Conf.HANDLER)));
  }
  
  public void construct(String host, int port, int securePort, Handler handler) throws Exception
  {
    destruct();
    
    org.eclipse.jetty.util.log.Log.setLog(new JettyLoggerNoLog());
    
    server = new Server();
    
    HttpConfiguration httpConf = new HttpConfiguration();
    httpConf.setSendServerVersion(false);
    
    httpConf.setSecureScheme("https");
    httpConf.setSecurePort(securePort);
    httpConf.addCustomizer(new SecureRequestCustomizer());
    
    HttpConnectionFactory httpConnectionFactory = new HttpConnectionFactory(httpConf);
    
    ServerConnector httpConnector = new ServerConnector(server, httpConnectionFactory);
    httpConnector.setName("http");
    httpConnector.setHost(host);
    httpConnector.setPort(port);
    
    server.addConnector(httpConnector);
    
//    ServerConnector httpConnector_ = new ServerConnector(server, httpConnectionFactory);
//    httpConnector_.setName("http2");
//    httpConnector_.setHost(host);
//    httpConnector_.setPort(8081);
//    
//    server.addConnector(httpConnector_);
    
    HttpConfiguration httpsConf = new HttpConfiguration();
    httpsConf.setSendServerVersion(false);
    httpsConf.addCustomizer(new SecureRequestCustomizer(true, -1, false));
    
    HttpConnectionFactory httpsConnectionFactory = new HttpConnectionFactory(httpsConf);
    
    SslContextFactory sslContextFactory = new SslContextFactory();
    sslContextFactory.setKeyManagerPassword("123456");
    sslContextFactory.setKeyStoreType("JKS");
    sslContextFactory.setKeyStorePath("conf/keystore");
    sslContextFactory.setKeyStorePassword("123456");
    sslContextFactory.setTrustStoreType(System.getProperty("jetty.sslContext.trustStoreType"));
    sslContextFactory.setTrustStorePath("conf/keystore");
    sslContextFactory.setTrustStorePassword("123456");
    sslContextFactory.addExcludeProtocols("SSL", "SSLv2", "SSLv2Hello", "SSLv3", "TLSv1");
    
    SslConnectionFactory sslConnectionFactory = new SslConnectionFactory(sslContextFactory, "http/1.1");
    
    ServerConnector httpsConnector = new ServerConnector(server, sslConnectionFactory, httpsConnectionFactory);
    httpsConnector.setName("https");
    httpsConnector.setHost(host);
    httpsConnector.setPort(securePort);
    
    server.addConnector(httpsConnector);
    
    if(handler != null)
    {
      server.setHandler(handler);
    }
    else
    {
      HandlerCollection handlerCollection = new HandlerCollection();
      server.setHandler(handlerCollection);
      
//      // http root webapp -> hides all the following registered that can only be acessed by api, not web url
//      WebAppContext webAppContext_ = new WebAppContext();
//      webAppContext_.setParentLoaderPriority(true);
//      webAppContext_.setVirtualHosts(new String[]{"@http2"});
//      webAppContext_.setContextPath("/");
//      webAppContext_.setResourceBase("tmp_wac_resource_base");
//      webAppContext_.setWelcomeFiles(new String[]{""});
//      
//      webAppContext_.getSessionHandler().setMaxInactiveInterval(500);
//      webAppContext_.getSessionHandler().addEventListener(new m.web.ListenerSession());
//      webAppContext_.getSessionHandler().getSessionCookieConfig().setHttpOnly(true);
//      webAppContext_.getSessionHandler().getSessionCookieConfig().setSecure(true);
//      
//      HttpServlet servlet_ = new m.web.WebServletAuthorization(m.Global.authorizator);
//      ServletHolder servletHolder_ = new ServletHolder(servlet_);
//      servletHolder_.getRegistration().setMultipartConfig(new MultipartConfigElement("", -1, -1, 0));
//      webAppContext_.addServlet(servletHolder_, "/");
//      
//      handlerCollection.addHandler(webAppContext_);
      
      // http to https redirector
      SecuredRedirectHandler securedRedirectHandler = new SecuredRedirectHandler();
      ContextHandler contextHandler = new ContextHandler();
      contextHandler.setHandler(securedRedirectHandler);
      contextHandler.setVirtualHosts(new String[]{"@http"});
      
      handlerCollection.addHandler(contextHandler);
      
      // root webapp -> hides all the following registered that can only be acessed by api, not web url
      WebAppContext webAppContext = new WebAppContext();
      webAppContext.setParentLoaderPriority(true);
      webAppContext.setVirtualHosts(new String[]{"@https"});
      webAppContext.setContextPath("/");
      webAppContext.setResourceBase("tmp_wac_resource_base");
      webAppContext.setWelcomeFiles(new String[]{""});
      
      webAppContext.getSessionHandler().setMaxInactiveInterval(500);
      webAppContext.getSessionHandler().addEventListener(new m.web.ListenerSession());
      webAppContext.getSessionHandler().getSessionCookieConfig().setHttpOnly(true);
      webAppContext.getSessionHandler().getSessionCookieConfig().setSecure(true);
      
      HttpServlet servlet = new m.web.WebServletAuthorization(m.Global.authorizator);
      ServletHolder servletHolder = new ServletHolder(servlet);
      servletHolder.getRegistration().setMultipartConfig(new MultipartConfigElement("", -1, -1, 0));
      webAppContext.addServlet(servletHolder, "/");
      
      handlerCollection.addHandler(webAppContext);
      
      // proxy webapp
      WebAppContext proxyWebAppContext = new WebAppContext();
      proxyWebAppContext.setParentLoaderPriority(true);
      proxyWebAppContext.setVirtualHosts(new String[]{"@https"});
      proxyWebAppContext.setContextPath("/proxy");
      proxyWebAppContext.setResourceBase("tmp_wac_resource_base");
      proxyWebAppContext.setWelcomeFiles(new String[]{""});
      
      HttpServlet proxyServlet = new JettyProxyServlet();
      ServletHolder proxyServletHolder = new ServletHolder(proxyServlet);
      proxyServletHolder.getRegistration().setMultipartConfig(new MultipartConfigElement("", -1, -1, 0));
      proxyWebAppContext.addServlet(proxyServletHolder, "/");
      
      handlerCollection.addHandler(proxyWebAppContext);
    }
    
    start();
  }
  
  public void destruct() throws Exception
  {
    if(server != null)
    {
      server.stop();
      server.destroy();
      server = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    configure((Handler) m.Global.objects.get(params.get(Conf.HANDLER)));
  }
  
  public void configure(Handler handler) throws Exception
  {
    if(handler != null)
    {
      server.setHandler(handler);
    }
  }
  
  public void start() throws Exception
  {
    server.start();
    server.dumpStdErr();
    server.join();
  }
  
  public void stop() throws Exception
  {
    server.stop();
  }
  
  public boolean isRunning() throws Exception
  {
    return server.isRunning();
  }
}

//public class JettyEmbedded implements ConfigurableObject
//{
//  Server server;
//  
//  public void construct() throws Exception
//  {
//  }
//  
//  public void destruct() throws Exception
//  {
//    if(server != null)
//    {
//      server.stop();
//      server = null;
//    }
//  }
//  
//  public void configure(DataObject conf) throws Exception
//  {
//    configure(conf.decimal(Conf.PORT).intValue(), (Handler) m.Global.objects.get(conf.get(Conf.HANDLER)), conf.string(Conf.XML));
////    configure(conf.integer(Conf.PORT).intValue(), (Handler) m.Global.objects.get(conf.get(Conf.HANDLER)), conf.string(Conf.XML));
//  }
//  
//  public void configure(int port, Handler handler, String xmlPath) throws Exception
//  {
//    destruct();
//    
//    org.eclipse.jetty.util.log.Log.setLog(new JettyLoggerNoLog());
//    
//    m.Global.log.debug(port, xmlPath);
//    
//    if(xmlPath != null && !"".equals(xmlPath))
//    {
//      server = (Server) new XmlConfiguration(new FileInputStream(xmlPath)).configure();
//    }
//    else
//    {
//      server = new Server(port);
//      for(Connector connector: server.getConnectors())
//      {
//        for(ConnectionFactory connectionFactory: connector.getConnectionFactories())
//        {
//          if(connectionFactory instanceof HttpConnectionFactory)
//          {
//            ((HttpConnectionFactory) connectionFactory).getHttpConfiguration().setSendServerVersion(false);
//          }
//        }
//      }
//    }
//    
//    if(handler != null)
//    {
//      server.setHandler(handler);
//    }
//    
//    server.start();
//    server.dumpStdErr();
//    server.join();
//  }
//}
