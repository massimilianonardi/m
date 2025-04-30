package m.stream;

import com.google.gson.*;

import m.object.*;

public class ObjOutputStreamJSON extends ObjOutputStream
{
  static protected Gson gson = new Gson();
  
  public ObjOutputStreamJSON(StreamOutput out) throws Exception
  {
    super(out);
  }
  
  protected void writeBinary(ByteArray object) throws Exception
  {
    // todo base64 encoding
    throw new Exception();
  }
  
  protected void writeStream(StreamInput object) throws Exception
  {
    // todo
    throw new Exception();
  }
  
  protected void writeObject(Object object) throws Exception
  {
    os.write(new ByteArray(gson.toJson(object).getBytes(m.enc.Encoding.UTF_8)));
  }
  
  protected void writeObject(Character object) throws Exception
  {
    os.write(new ByteArray(object.toString().getBytes(m.enc.Encoding.UTF_8)));
  }
  
  protected void writeStart() throws Exception
  {
  }
  
  protected void writeEnd() throws Exception
  {
  }
  
  protected void writeMapStart() throws Exception
  {
    writeObject('{');
  }
  
  protected void writeMapEnd() throws Exception
  {
    writeObject('}');
  }
  
  protected void writeMapElementStart(String name) throws Exception
  {
    writeObject("\"" + name.replace("\"", "\\\"") + "\":");
  }
  
  protected void writeMapElementEnd(String name) throws Exception
  {
  }
  
  protected void writeMapElementSeparator() throws Exception
  {
    writeObject(',');
  }
  
  protected void writeListStart() throws Exception
  {
    writeObject('[');
  }
  
  protected void writeListEnd() throws Exception
  {
    writeObject(']');
  }
  
  protected void writeListElementStart() throws Exception
  {
  }
  
  protected void writeListElementEnd() throws Exception
  {
  }
  
  protected void writeListElementSeparator() throws Exception
  {
    writeObject(',');
  }
}
