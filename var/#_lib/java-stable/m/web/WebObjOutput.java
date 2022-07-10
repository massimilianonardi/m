package m.web;

import java.io.*;
import java.util.*;

import javax.servlet.*;
import javax.servlet.http.*;

import m.object.*;
import m.stream.*;

//public class WebObjOutput extends ObjOutputStreamXML
public class WebObjOutput extends ObjOutputStreamJSON
{
//  protected HttpServletResponse response;
  public HttpServletResponse response;
  
  public WebObjOutput(HttpServletResponse response) throws Exception
  {
    super(null);
    
    this.response = response;
    
    os = new WrapperIOByteStreamOutput(response.getOutputStream());
  }
  
  public HttpServletResponse getHttpServletResponse() throws Exception
  {
    return response;
  }
}
