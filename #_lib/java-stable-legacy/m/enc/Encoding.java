package m.enc;

import java.util.*;

public class Encoding
{
  static public final String UTF_8 = "UTF-8";
  
  static public String toHEXString(byte[] bytes)
  {
    if(bytes == null)
    {
      return null;
    }
    
    StringBuilder hex = new StringBuilder();
    for(byte b: bytes)
    {
      hex.append(String.format("%02x", b));
    }
    
    return hex.toString();
  }
  
  static public byte[] toBase64(byte[] bytes)
  {
    return Base64.getEncoder().encode(bytes);
  }
  
  static public String toBase64String(byte[] bytes)
  {
    return Base64.getEncoder().encodeToString(bytes);
  }
  
  static public byte[] fromBase64(byte[] base64)
  {
    return Base64.getDecoder().decode(base64);
  }
  
  static public byte[] fromBase64String(String base64)
  {
    return Base64.getDecoder().decode(base64);
  }
}
