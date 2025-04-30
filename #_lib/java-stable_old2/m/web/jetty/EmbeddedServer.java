package m.web.jetty;

import java.lang.*;
import java.io.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.util.ssl.*;

import m.object.*;
import m.conf.*;
//import m.service.*;

// todo: main connector params required, additional connectors under "connectors" list
// each connector has "secure" that if boolean determines if http/https and also keystore params
// if "secure" is number, then it is http and that number is the secure redirect port and no ssl connector is automatically created
public class EmbeddedServer implements ConfigurableObject, m.service.Server
{
public class AppendableLogger implements Appendable
{
  protected String buffer = "";
  
  public Appendable append(CharSequence arg0) throws IOException
  {
    buffer += arg0;

    return this;
  }
  
  public Appendable append(CharSequence arg0, int arg1, int arg2) throws IOException
  {
    return append(arg0);
  }
  
  public Appendable append(char arg0) throws IOException
  {
    m.Global.log.debug(buffer + arg0);
    buffer = "";

    return this;
  }
}
  protected Server server;
  
  public void construct(Obj args) throws Exception
  {
    construct(args.string(Conf.HOST), args.integer(Conf.PORT), args.integer(Conf.SECURE), (Handler) m.Global.objects.get(args.get(Conf.HANDLER)));
  }
  
  public void construct(String host, Long port, Long securePort, Handler handler) throws Exception
  {
    destruct();
    
//    System.setProperty("org.eclipse.jetty.util.log.class", "org.eclipse.jetty.util.log.StdErrLog");
//    System.setProperty("org.eclipse.jetty.LEVEL", "OFF");
    org.eclipse.jetty.util.log.Log.setLog(new NullLogger());
    
    server = new Server();
    
    HttpConfiguration httpConf = new HttpConfiguration();
    httpConf.setSendServerVersion(false);
    httpConf.setSendDateHeader(false);
    httpConf.setSendXPoweredBy(false);
    
    if(securePort != null)
    {
      httpConf.setSecureScheme("https");
//      httpConf.setSecurePort(securePort.intValue());
      httpConf.setSecurePort(Math.abs(securePort.intValue()));
//      httpConf.addCustomizer(new SecureRequestCustomizer(false, -1, false));
    }
    
    HttpConnectionFactory httpConnectionFactory = new HttpConnectionFactory(httpConf);
    
    if(port != null)
    {
      ServerConnector httpConnector = new ServerConnector(server, httpConnectionFactory);
      httpConnector.setName("http");
      httpConnector.setHost(host);
      httpConnector.setPort(port.intValue());
      
      server.addConnector(httpConnector);
    }
    
    if(securePort != null && 0 < securePort.intValue())
    {
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
      
      ServerConnector httpsConnector = new ServerConnector(server, sslConnectionFactory, httpConnectionFactory);
      httpsConnector.setName("https");
      httpsConnector.setHost(host);
      httpsConnector.setPort(securePort.intValue());
      
      server.addConnector(httpsConnector);
    }
    
    if(handler != null)
    {
      server.setHandler(handler);
    }
    else
    {
      throw new Exception();
//      AuthorizationServiceHandler authz = new AuthorizationServiceHandler();
//      authz.construct();
//      server.setHandler(authz);
    }
  }
  
  public void destruct() throws Exception
  {
    if(server != null)
    {
      server.setStopTimeout(1);
      server.stop();
      server.destroy();
      server = null;
    }
    
    m.Global.log.debug(true);
  }
  
  public void configure(Obj params) throws Exception
  {
//    configure((Handler) m.Global.objects.get(params.get(Conf.HANDLER)), params.string(Conf.XML));
  }
  
  public void configure(Handler handler, String xmlPath) throws Exception
  {
//    destruct();
    
    m.Global.log.debug("JETTY EMBEDDED SERVER CONFIGURE: TODO CUSTOM PARAMETERS");
  }
  
  public void start() throws Exception
  {
    server.start();
//    server.dumpStdErr();
    server.dump(new AppendableLogger());
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
