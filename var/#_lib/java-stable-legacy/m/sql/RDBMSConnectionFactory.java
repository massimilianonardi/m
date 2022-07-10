package m.sql;

import java.util.*;
import java.sql.*;

import m.object.*;
import m.conf.*;

public class RDBMSConnectionFactory implements Factory<Connection>, ConfigurableObject
{
  protected String driver;
  protected String url;
  protected String username;
  protected String password;
  
  protected List<Connection> connections;
  
  public RDBMSConnectionFactory() throws Exception
  {
    this(null, null, null, null);
  }
  
  public RDBMSConnectionFactory(String driver, String url, String username, String password) throws Exception
  {
    construct(driver, url);
    configure(username, password);
  }
  
  public void construct(Obj args) throws Exception
  {
    construct(args.string(Conf.DRIVER), args.string(Conf.URL));
  }
  
  public void construct(String driver, String url) throws Exception
  {
    destruct();
    
    this.driver = driver;
    this.url = url;
    
    connections = new ArrayList();
    
    if(driver != null && !"".equals(driver))
    {
      Class.forName(driver);
    }
  }
  
  public void destruct() throws Exception
  {
    if(connections != null)
    {
      for(int i = 0; i < connections.size(); i++)
      {
        try
        {
          connections.get(i).close();
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      }
      
      connections.clear();
      connections = null;
    }
    
    if(driver != null && !"".equals(driver))
    {
      ClassLoader cl = Thread.currentThread().getContextClassLoader();
      Enumeration<Driver> drivers = DriverManager.getDrivers();
      while(drivers.hasMoreElements())
      {
        Driver driver = drivers.nextElement();
        if(driver.getClass().getClassLoader() == cl)
        {
          try
          {
            DriverManager.deregisterDriver(driver);
          }
          catch(Exception e)
          {
            e.printStackTrace();
          }
        }
//        else
//        {
//        }
      }
      
      driver = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    configure(params.string(Conf.USER), params.string(Conf.PASSWORD));
  }
  
  public void configure(String username, String password) throws Exception
  {
    this.username = username;
    this.password = password;
  }
  
  public synchronized Connection create() throws Exception, SQLException
  {
    if(driver == null || "".equals(driver))
    {
      throw new Exception();
    }
    
    Connection connection = DriverManager.getConnection(url, username, password);
    connections.add(connection);
    
    return connection;
  }
  
  public synchronized void destroy(Connection connection) throws Exception, SQLException
  {
    connection.close();
    connections.remove(connection);
  }
  
  public boolean check(Connection connection) throws Exception
  {
    return connection.isValid(0);
  }
}
