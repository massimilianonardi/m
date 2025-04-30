package m.conf;

import m.object.*;

public interface Configurable
{
//  public void configure(Obj params) throws Exception;
//  
//  default public void configure(Configuration conf) throws Exception
//  {
//    conf.listener(this);
//    configure((Obj) conf);
//  }
  
  default public void configure(Obj params) throws Exception
  {
  }
  
  default public void configure(Configuration conf) throws Exception
  {
    conf.listener(this);
    configure((Obj) conf);
  }
}
