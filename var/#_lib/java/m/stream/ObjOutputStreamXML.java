package m.stream;

import m.object.*;

public class ObjOutputStreamXML extends ObjOutputStream
{
  public ObjOutputStreamXML(StreamOutput out) throws Exception
  {
    super(out);
  }
  
  protected void writeObject(Object object) throws Exception
  {
    os.write(new ByteArray(object.toString().getBytes(m.enc.Encoding.UTF_8)));
  }
  
  protected void writeStart() throws Exception
  {
    writeObject("<xml>");
  }
  
  protected void writeEnd() throws Exception
  {
    writeObject("</xml>");
  }
  
  protected void writeMapStart() throws Exception
  {
    writeObject("<map>");
  }
  
  protected void writeMapEnd() throws Exception
  {
    writeObject("</map>");
  }
  
  protected void writeMapElementStart(String name) throws Exception
  {
    writeObject(("<" + name + ">"));
  }
  
  protected void writeMapElementEnd(String name) throws Exception
  {
    writeObject(("</" + name + ">"));
  }
  
  protected void writeMapElementSeparator() throws Exception
  {
  }
  
  protected void writeListStart() throws Exception
  {
    writeObject("<list>");
  }
  
  protected void writeListEnd() throws Exception
  {
    writeObject("</list>");
  }
  
  protected void writeListElementStart() throws Exception
  {
    writeObject("<element>");
  }
  
  protected void writeListElementEnd() throws Exception
  {
    writeObject("</element>");
  }
  
  protected void writeListElementSeparator() throws Exception
  {
  }
}
