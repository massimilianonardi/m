package m.file;

import java.nio.file.*;

public class CHRootFileSystem extends WrapperFileSystem
{
  protected String path(String path) throws Exception
  {
    if(path == null)
    {
      return root();
    }
    
    Path p;
    Path rootPath = Paths.get(root()).normalize();
    String separator = FileSystems.getDefault().getSeparator();
    if(separator == null)
    {
      p = rootPath.resolve(path).normalize();
    }
    else
    {
      p = rootPath.resolve(path.replace("/", separator)).normalize();
    }
    
    if(!p.startsWith(rootPath))
    {
      throw new Exception();
    }
    
    return p.toString();
  }
}
