package m.web;

import java.io.*;
import java.util.*;

import javax.servlet.*;
import javax.servlet.http.*;

import com.google.gson.*;

import m.object.*;
import m.stream.*;

// todo initialize some params with request attributes to allow deep request authorization
public class WebObjInput extends ObjInputStream
{
  protected HttpServletRequest request;
  
  static protected Gson gson = new Gson();
  
  protected boolean paramsInitialized = false;
  protected boolean multipart;
  protected Collection<Part> parts;
  protected Iterator<Part> partsIterator;
  protected Enumeration<String> paramsEnumeration;
  
//  public WebObjInput(HttpServletRequest request) throws Exception
//  {
//    this.request = request;
//    init();
//  }
//  
//  public HttpServletRequest getHttpServletRequest() throws Exception
//  {
//    return request;
//  }
//  
//  public Object object() throws Exception
//  {
//    List list = (List) super.object();
//    if(list == null)
//    {
//      return null;
//    }
//    else
//    {
//      return list.get(1);
//    }
//  }
  
  // the following require deep redesign of file stream upload and services and objinput and everything...
  public WebObjInput(HttpServletRequest request) throws Exception
  {
    this.request = request;
    init();
    
    parseAsMap();
    Map map = (Map) object;
    map.put("request/ip", request.getRemoteAddr());
    map.put("request/timestamp/access", "" + System.currentTimeMillis());
    map.put("request/time/interval", "" + (System.currentTimeMillis() - request.getSession().getLastAccessedTime()));
    map.put("request/size", "" + request.getContentLengthLong());
    map.put("request/type", request.getContentType());
    map.put("request/dispatcher", request.getDispatcherType().toString());
    map.put("request/agent", request.getHeader("User-Agent"));
  }
  
  public HttpServletRequest getHttpServletRequest() throws Exception
  {
    return request;
  }
  
  public Object object___() throws Exception
  {
    List list = (List) super.object();
    if(list == null)
    {
      return null;
    }
    else
    {
      return list.get(1);
    }
  }
  
  protected void init() throws Exception
  {
    if(paramsInitialized)
    {
      return;
    }
    
    if(request.getContentType() != null && -1 < request.getContentType().toLowerCase().indexOf("multipart/form-data")) 
    {
      multipart = true;
      parts = request.getParts();
      partsIterator = parts.iterator();
    }
    else
    {
      multipart = false;
      paramsEnumeration = request.getParameterNames();
    }
    
    paramsInitialized = true;
  }
  
  protected Obj next() throws Exception
  {
    init();
    
    List list = new ArrayList();
    Obj obj = new Obj(list);
    
    if(multipart)
    {
      Part part = this.partsIterator.next();
      String name = part.getName();
      list.add(name);
      
      String type = part.getContentType();
      long size = part.getSize();
      String fileName = part.getSubmittedFileName();

      System.out.println("PART type: " + type);
      System.out.println("PART name: " + name);
      System.out.println("PART size: " + size);
      System.out.println("PART sub filename: " + fileName);
      System.out.println("PART header names: " + part.getHeaderNames().toString());
      System.out.println("PART content-disposition: " + part.getHeader("content-disposition"));

      InputStream inputStream = part.getInputStream();
      if((fileName != null))
      {
        System.out.println("PART IS A FILE STREAM");
        list.set(0, fileName);
        if("".equals(fileName))
        {
          fileName = "" + System.currentTimeMillis();
        }
        Stream file = new m.file.___OSFSFileStream(fileName);
        file.streamFromInput(new WrapperIOByteStreamInput(inputStream));
//        file.close();
//        file.open();
        file = new m.file.___OSFSFileStream(fileName);
        ((m.file.___OSFSFileStream) file).deleteOnClose = true;
//        FileOutputStream result = new FileOutputStream(fileName);
//        byte[] buffer = new byte[1024];
//        int length;
//        while((length = inputStream.read(buffer)) != -1)
//        {
//          result.write(buffer, 0, length);
//        }
        
        list.add(file);
      }
      else
      {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while((length = inputStream.read(buffer)) != -1)
        {
          result.write(buffer, 0, length);
        }
        
//        list.add(result.toString(m.enc.Encoding.UTF_8));
        list.add(gson.fromJson(result.toString(m.enc.Encoding.UTF_8), Object.class));
      }
    }
    else
    {
      String name = paramsEnumeration.nextElement();
      String value = request.getParameter(name);
      list.add(name);
      Object val = null;
      try
      {
        val = gson.fromJson(value, Object.class);
      }
      catch(Exception e)
      {
        m.Global.log.trace("NOT A JSON OBJECT!!!", value);
        val = value;
      }
      list.add(val);
//      list.add(request.getParameter(name));
//      list.add(gson.fromJson(request.getParameter(name), Object.class));
    }
    
    return obj;
  }
  
  protected boolean hasEnded() throws Exception
  {
    if(multipart)
    {
      return !(partsIterator.hasNext());
    }
    else
    {
      if(paramsEnumeration == null)
      {
        return true;
      }
      else
      {
        return !(paramsEnumeration.hasMoreElements());
      }
    }
  }
}
