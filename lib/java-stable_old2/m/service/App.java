package m.service;

import java.io.*;
import java.util.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.file.*;
import m.stream.*;

public class App extends ConfigurableWrapper<FileSystem> implements AuthorizedService, ConfigurableObject
{
  final protected String APP_LIST_CMD = "@list";
  final protected String APP_INFO_CMD = "@info";
  final protected String APP_DIR_CMD = "@dir";
  final protected String APP_FIND_CMD = "@find";
  final protected String PARAM_REGEX = "regex";
  final protected String APP_JSON = "app.json";
  final protected String APP_PREFIX = "/m/app/";
  final protected String PAGE_PREFIX = "" + 
    "<!DOCTYPE html>\n" + 
    "<html>\n" + 
    "  <head>\n" + 
    "    <title> </title>\n" + 
    "    <meta charset=\"UTF-8\">\n" + 
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" + 
    "";
  final protected String PAGE_MIDDLE = "" + 
    "  </head>\n" + 
    "  <body style=\"\n" + 
    "    width: 100%;\n" + 
    "    height: 100%;\n" + 
    "    border: 0;\n" + 
    "    margin: 0;\n" + 
    "    padding: 0;\n" + 
    "    overflow: hidden;\n" + 
    "  \">\n" + 
    "";
  final protected String PAGE_SUFFIX = "" + 
    "  </body>\n" + 
    "</html>\n" + 
    "";
  
  protected String appPrefix = APP_PREFIX;
  
  public void configure(Obj params) throws Exception
  {
    super.configure(params);
    
    if(params.string(Conf.PREFIX) != null)
    {
      appPrefix = params.string(Conf.PREFIX);
    }
  }
  
  public void execute(AuthorizatorSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    if(get().isFile(command))
    {
      StreamSeekable ss = get().stream(command);
      out.set(ss);
      ss.close();
    }
    else if(get().isNode(command))
    {
      String path = command;
      
      if(!"".equals(path) && !path.endsWith("/"))
      {
        path += "/";
      }
      
      String appJSONFile = path + APP_JSON;
      if(get().isFile(appJSONFile))
      {
        Obj appJSON = new Obj();
        appJSON.streamFromInput(get().read(appJSONFile));
        String page = PAGE_PREFIX + 
          "    <script> this.root = \"/" + path.substring(0, 0 < path.length() ? path.length() - 1 : 0) + "\"; </script>\n" + 
          "";
        
        List<String> cssList = appJSON.list("css");
        if(cssList != null)
        {
          for(int i = 0; i < cssList.size(); i++)
          {
            String cssFile = cssList.get(i);
            if(cssFile.startsWith("/"))
            {
              page += "" + 
              "    <link type=\"text/css\" rel=\"stylesheet\" href=\"" + appPrefix + cssFile.substring(1) + "\">\n" + 
              "";
            }
            else
            {
              page += "" + 
              "    <link type=\"text/css\" rel=\"stylesheet\" href=\"" + appPrefix + path + cssFile + "\">\n" + 
              "";
            }
          }
        }
        
        page += PAGE_MIDDLE;
        
        List<String> jsList = appJSON.list("js");
        if(jsList != null)
        {
          for(int i = 0; i < jsList.size(); i++)
          {
            String jsFile = jsList.get(i);
            if(jsFile.startsWith("/"))
            {
              page += "" + 
              "    <script src=\"" + appPrefix + jsFile.substring(1) + "\" charset=\"UTF-8\"></script>\n" + 
              "";
            }
            else
            {
              page += "" + 
              "    <script src=\"" + appPrefix + path + jsFile + "\" charset=\"UTF-8\"></script>\n" + 
              "";
            }
          }
        }
        
        page += PAGE_SUFFIX;
        
        m.Global.log.debug(path, page);
        
        out.set(new WrapperIOByteStreamInput(new ByteArrayInputStream(page.getBytes(m.enc.Encoding.UTF_8))));
      }
      else
      {
        throw new Exception();
      }
    }
    else if(command != null && command.endsWith(APP_LIST_CMD))
    {
      String path = command.substring(0, command.length() - APP_LIST_CMD.length());
      if(get().isNode(path))
      {
        Map<String, String> o = new HashMap<String, String>();
        o.put("regex", ".*/" + APP_JSON);
        List<String> l = get().find(path, o).list();
        List<String> list = new ArrayList<String>();
        for(int i = 0; i < l.size(); i++)
        {
          String s = l.get(i);
          if(session.authorize(appPrefix.substring(1) + s))
          {
            list.add("/" + s.substring(0, APP_JSON.equals(s) ? s.lastIndexOf(APP_JSON) : s.lastIndexOf("/" + APP_JSON)));
//            list.add("/" + s.substring(0, s.lastIndexOf("/" + APP_JSON)));
//            list.add(s.substring(0, s.lastIndexOf(APP_JSON)));
          }
        }
        
        list.sort(null);
        
        out.set(list);
      }
      else
      {
        throw new Exception();
      }
    }
    else if(command != null && command.endsWith(APP_INFO_CMD))
    {
      String path = command.substring(0, command.length() - APP_INFO_CMD.length());
      if(get().isNode(path))
      {
        Map<String, String> o = new HashMap<String, String>();
        String regex = in.string(PARAM_REGEX) == null ? ".*/" + APP_JSON : in.string(PARAM_REGEX);
        o.put("regex", get().root() + "/" + path + regex);
//        o.put("regex", ".*/" + APP_JSON);
        List<String> l = get().find(path, o).list();
        Obj info = new Obj(new HashMap<String, Object>());
        for(int i = 0; i < l.size(); i++)
        {
          String s = l.get(i);
          if(session.authorize(appPrefix.substring(1) + s))
          {
            Obj appInfo = new Obj();
            if(!get().isFile(s)) continue;
            appInfo.streamFromInput(get().read(s));
            int index = APP_JSON.equals(s) ? s.lastIndexOf(APP_JSON) : s.lastIndexOf("/" + APP_JSON);
            if(index == -1) index = s.length();
            if(appInfo.type(Map.class)) info.set("/" + s.substring(0, index), appInfo.map());
            else info.set("/" + s.substring(0, index), appInfo.list());
//            info.set("/" + s.substring(0, s.lastIndexOf("/" + APP_JSON)), appInfo.map());
//            info.set(s.substring(0, s.lastIndexOf(APP_JSON)), appInfo.map());
          }
        }
        
        out.set(info.map());
      }
      else
      {
        throw new Exception();
      }
    }
    else if(command != null && command.endsWith(APP_DIR_CMD))
    {
      String path = command.substring(0, command.length() - APP_DIR_CMD.length());
      if(get().isNode(path))
      {
        List<String> l = get().list(path).list();
        List<String> list = new ArrayList<String>();
        for(int i = 0; i < l.size(); i++)
        {
          String s = l.get(i);
          if(session.authorize(appPrefix.substring(1) + s))
          {
            list.add("/" + s);
          }
        }
        
        list.sort(null);
        
        out.set(list);
      }
      else
      {
        throw new Exception();
      }
    }
    else if(command != null && command.endsWith(APP_FIND_CMD))
    {
      String path = command.substring(0, command.length() - APP_FIND_CMD.length());
      if(get().isNode(path))
      {
        Map<String, String> o = new HashMap<String, String>();
        String regex = in.string(PARAM_REGEX) == null ? ".*" : in.string(PARAM_REGEX);
        o.put("regex", get().root() + "/" + path + regex);
        List<String> l = get().find(path, o).list();
        List<String> list = new ArrayList<String>();
        for(int i = 0; i < l.size(); i++)
        {
          String s = l.get(i);
          if(session.authorize(appPrefix.substring(1) + s))
          {
            list.add("/" + s);
          }
        }
        
        list.sort(null);
        
        out.set(list);
      }
      else
      {
        throw new Exception();
      }
    }
    else
    {
      throw new Exception();
    }
  }
}

//public class App implements AuthorizedService, ConfigurableObject
//{
//  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
//  {
//    String path = command;
//    
//    if(!"".equals(path) && !path.endsWith("/"))
//    {
//      path += "/";
//    }
//    
//    String page = "" + 
//"<!DOCTYPE html>\n" +
//"<html>\n" +
//"  <head>\n" +
//"    <title> </title>\n" +
//"    <meta charset=\"UTF-8\">\n" +
//"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
//"    <script src=\"/m/data.read/web.app.file/lib/m/js.js\" charset=\"UTF-8\"></script>\n" +
//"    <script> this.root = \"" + path + "\"; </script>\n" +
//"    <script src=\"/m/data.read/web.app.file/pub/init/app.js\" charset=\"UTF-8\"></script>\n" +
//"  </head>\n" +
//"  <body style=\"\n" +
//"    width: 100%;\n" +
//"    height: 100%;\n" +
//"    border: 0;\n" +
//"    margin: 0;\n" +
//"    padding: 0;\n" +
//"    overflow: hidden;\n" +
//"  \">\n" +
//"  </body>\n" +
//"</html>\n" +
//"";
//    
//    m.Global.log.debug(path, page);
//    
//    out.set(new WrapperIOByteStreamInput(new ByteArrayInputStream(page.getBytes(m.enc.Encoding.UTF_8))));
//  }
//}
