package m.service;

import java.io.*;

import m.object.*;
import m.conf.*;
import m.auth.*;
import m.stream.*;

public class App implements AuthorizedService, ConfigurableObject
{
  public void execute(AuthorizationSession session, String command, ObjInput in, ObjOutput out) throws Exception
  {
    String path = command;
    
    if(!"".equals(path) && !path.endsWith("/"))
    {
      path += "/";
    }
    
    String page = "" + 
"<!DOCTYPE html>\n" +
"<html>\n" +
"  <head>\n" +
"    <title> </title>\n" +
"    <meta charset=\"UTF-8\">\n" +
"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
"    <script src=\"/m/data.read/web.app.file/lib/m/js.js\" charset=\"UTF-8\"></script>\n" +
"    <script> this.root = \"" + path + "\"; </script>\n" +
"    <script src=\"/m/data.read/web.app.file/pub/init/app.js\" charset=\"UTF-8\"></script>\n" +
"  </head>\n" +
"  <body style=\"\n" +
"    width: 100%;\n" +
"    height: 100%;\n" +
"    border: 0;\n" +
"    margin: 0;\n" +
"    padding: 0;\n" +
"    overflow: hidden;\n" +
"  \">\n" +
"  </body>\n" +
"</html>\n" +
"";
    
    m.Global.log.debug(path, page);
    
    out.set(new WrapperIOByteStreamInput(new ByteArrayInputStream(page.getBytes(m.enc.Encoding.UTF_8))));
  }
}
