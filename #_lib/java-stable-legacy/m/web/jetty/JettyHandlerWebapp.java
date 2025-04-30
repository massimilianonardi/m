package m.web.jetty;

import java.io.*;

import org.eclipse.jetty.webapp.*;

import m.object.*;
import m.conf.*;

public class JettyHandlerWebapp extends WebAppContext implements ConfigurableObject
{
  static final protected String CONF_PATH = "path";
  static final protected String CONF_DIR = "dir";
  static final protected String CONF_WAR = "war";
  static final protected String CONF_WAR_EXTRACT = "war.extract";
  static final protected String CONF_TMP = "tmp";
  static final protected String CONF_SHARE = "share";
  static final protected String CONF_JSP = "jsp";
  
  static final protected String DEFAULT_DESCRIPTOR = "/WEB-INF/web.xml";
  
  public void configure(Obj conf) throws Exception
  {
    String path = conf.string(CONF_PATH);
    String dir = conf.string(CONF_DIR);
    String war = conf.string(CONF_WAR);
    Boolean warExtract = conf.bool(CONF_WAR_EXTRACT);
    String tmp = conf.string(CONF_TMP);
    Boolean share = conf.bool(CONF_SHARE);
    Boolean jsp = conf.bool(CONF_JSP);
    
    m.Global.log.debug(CONF_PATH, path, CONF_DIR, dir, CONF_WAR, war, CONF_WAR_EXTRACT, warExtract, CONF_TMP, tmp, CONF_JSP, jsp);
    
    setContextPath(path);
    
    if(dir != null && !"".equals(dir))
    {
      m.Global.log.debug(new File(dir).getAbsolutePath(), new File(dir + DEFAULT_DESCRIPTOR).getAbsolutePath());
      
      setResourceBase(dir);
      setDescriptor(dir + DEFAULT_DESCRIPTOR);
    }
    else if(war != null && !"".equals(war))
    {
      m.Global.log.debug(new File(war).getAbsolutePath());
      
      setWar(new File(war).getAbsolutePath());
      if(warExtract == null || warExtract == true)
      {
        setExtractWAR(true);
      }
      else
      {
        setExtractWAR(false);
        setCopyWebDir(true);
        setCopyWebInf(true);
      }
    }
    
    if(tmp != null && !"".equals(tmp))
    {
      setTempDirectory(new File(tmp));
    }
    
    if(share != null && share == true)
    {
      setParentLoaderPriority(true);
    }
    
    if(jsp == null || jsp == true)
    {
//      ClassLoader jspClassLoader = new URLClassLoader(new URL[0], this.getClass().getClassLoader());
//      setClassLoader(jspClassLoader);
//      addBean(new JspStarter(this));
//      ServletHolder holderJsp = new ServletHolder("jsp", JettyJspServlet.class);
//      holderJsp.setInitOrder(0);
//      holderJsp.setInitParameter("logVerbosityLevel", "DEBUG");
//      holderJsp.setInitParameter("fork", "false");
//      holderJsp.setInitParameter("xpoweredBy", "false");
//      holderJsp.setInitParameter("compilerTargetVM", "1.8");
//      holderJsp.setInitParameter("compilerSourceVM", "1.8");
//      holderJsp.setInitParameter("keepgenerated", "true");
//      addServlet(holderJsp, "*.jsp");
      
//      setAttribute("org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern",".*/[^/]*jstl.*\\.jar$");
//      org.eclipse.jetty.webapp.Configuration.ClassList classlist = org.eclipse.jetty.webapp.Configuration.ClassList.setServerDefault(server);
    }
  }
}
