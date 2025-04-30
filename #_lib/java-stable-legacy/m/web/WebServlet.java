package m.web;

import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

abstract public class WebServlet extends HttpServlet
{
//  public void init(ServletConfig config)
//  {
//  }
  
//  public void destroy()
//  {
//  }
  
//  public void service(ServletRequest request, ServletResponse response) throws ServletException, IOException
//  {
//  }
  
//  final public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    try
//    {
//      this.exec(request, response);
//    }
//    catch(Exception e)
//    {
//      e.printStackTrace();
//      throw new ServletException(e);
//    }
//  }
  
  final public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
  {
    try
    {
      this.exec(request, response);
    }
    catch(Exception e)
    {
      try
      {
        java.util.List<String> stackTrace = new java.util.ArrayList();
        for(StackTraceElement k: e.getStackTrace())
        {
          stackTrace.add(k.getClassLoaderName() + "/" + k.getClassName() + "." + k.getMethodName()+ ":" + k.getLineNumber());
        }
        
        m.Global.log.error(e.toString(), stackTrace);
        
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      }
      catch(Exception ex)
      {
        ex.printStackTrace();
        e.printStackTrace();
      }
    }
  }
  
  abstract public void exec(HttpServletRequest request, HttpServletResponse response) throws Exception;
  
//  public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doHead(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
//  
//  public void doTrace(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
//  {
//    this.exec(request, response);
//  }
}
