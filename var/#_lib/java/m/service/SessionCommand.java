package m.service;

import m.object.*;
import m.conf.*;
import m.auth.*;

public class SessionCommand extends ConfigurableWrapper<Z_AuthorizedService> implements Z_AuthorizedService, Z_Authorizator.Listener
{
  public void configure(Obj params) throws Exception
  {
////    m.Global.authorizator.addListener(this);
//    m.Global.objects.iface(Authorizator.class).addListener(this);
////    m.Global.objects.ifaces(Authorizator.class).entrySet().iterator().next().getValue().addListener(this);
  }
  
  public void execute(Z_AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String p = java.nio.file.Paths.get(command).normalize().toString();
    if(p.startsWith(".."))
    {
      throw new Exception();
    }
    
    object.execute(session, session.id() + "/" + command, in, out);
  }
  
  public void sessionCreated(Z_AuthorizationSession session) throws Exception
  {
    if(object instanceof Z_Authorizator.Listener)
    {
      ((Z_Authorizator.Listener) object).sessionCreated(session);
    }
  }
  
  public void sessionDestroyed(Z_AuthorizationSession session) throws Exception
  {
    if(object instanceof Z_Authorizator.Listener)
    {
      ((Z_Authorizator.Listener) object).sessionDestroyed(session);
    }
  }
  
  public void sessionRenamed(Z_AuthorizationSession session) throws Exception
  {
    if(object instanceof Z_Authorizator.Listener)
    {
      ((Z_Authorizator.Listener) object).sessionDestroyed(session);
    }
  }
}

//public class SessionCommand extends ConfigurableWrapper<AuthorizedService> implements AuthorizedService, Authorizator.Listener
//{
//  protected String cmdCreate;
//  protected Obj cmdCreateIn;
//  
//  protected String cmdDestroy;
//  protected Obj cmdDestroyIn;
//  
//  public void configure(Obj params) throws Exception
//  {
//    cmdCreate = params.string(Conf.ERROR);
//    cmdCreateIn = params.get(Conf.ERROR);
//    
//    cmdDestroy = params.string(Conf.ERROR);
//    cmdDestroyIn = params.get(Conf.ERROR);
//    
//    if(params.bool(Conf.REGISTER))
//    {
//      m.Global.authorizator.addListener(this);
//    }
//  }
//  
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
//  {
//    String p = java.nio.file.Paths.get(command).normalize().toString();
//    if(p.startsWith(".."))
//    {
//      throw new Exception();
//    }
//    
//    object.execute(session, session.id() + "/" + command, in, out);
//  }
//  
//  public void create(AuthorizationSession session) throws Exception
//  {
//    if(cmdCreate != null)
//    {
////      session.execute(cmdCreate, cmdCreateIn, new Obj());
////      session.execute(cmdCreate, new Obj(session.id()), new Obj());
//      session.execute(cmdCreate + "/" + session.id(), cmdCreateIn, new Obj());
//    }
//    
//    if(object instanceof Authorizator.Listener)
//    {
//      ((Authorizator.Listener) object).create(session);
//    }
//  }
//  
//  public void destroy(AuthorizationSession session) throws Exception
//  {
//    if(object instanceof Authorizator.Listener)
//    {
//      ((Authorizator.Listener) object).destroy(session);
//    }
//    
//    if(cmdDestroy != null)
//    {
////      session.execute(cmdDestroy, cmdDestroyIn, new Obj());
////      session.execute(cmdDestroy, new Obj(session.id()), new Obj());
//      session.execute(cmdDestroy + "/" + session.id(), cmdDestroyIn, new Obj());
//    }
//  }
//}
