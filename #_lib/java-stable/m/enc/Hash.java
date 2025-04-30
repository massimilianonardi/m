package m.enc;

import java.security.*;
import java.io.*;

import m.object.*;
import m.stream.*;

public class Hash
{
  static public final String MD5 = "MD5";
  static public final String SHA3_256 = "SHA3-256";
  static public final String SHA3_512 = "SHA3-512";
  
  static public final String DEFAULT = SHA3_512;
  
  static public byte[] hash(String alg, byte[] source) throws Exception
  {
    return MessageDigest.getInstance(alg).digest(source);
  }
  
  static public byte[] hash(String alg, String source) throws Exception
  {
    return hash(alg, source.getBytes(Encoding.UTF_8));
  }
  
  static public byte[] hash(String alg, InputStream is) throws Exception
  {
    MessageDigest md = MessageDigest.getInstance(alg);
    byte[] buffer = new byte[ByteArray.DEFAULT];
    int length = is.read(buffer);
    while(length != -1)
    {
      md.update(buffer, 0, length);
      length = is.read(buffer);
    }
    return md.digest();
  }
  
  static public byte[] hash(String alg, StreamInput is) throws Exception
  {
    MessageDigest md = MessageDigest.getInstance(alg);
    ByteArray buffer = new ByteArray();
    while(!is.eos())
    {
      buffer = is.readBytes();
      md.update(buffer.buffer(), 0, buffer.length());
    }
    return md.digest();
  }
  
  static public byte[] hash(byte[] source) throws Exception
  {
    return hash(DEFAULT, source);
  }
  
  static public byte[] hash(String source) throws Exception
  {
    return hash(DEFAULT, source);
  }
  
  static public byte[] hash(InputStream is) throws Exception
  {
    return hash(DEFAULT, is);
  }
  
  static public byte[] hash(StreamInput is) throws Exception
  {
    return hash(DEFAULT, is);
  }
  
  static public String hashString(String alg, byte[] source) throws Exception
  {
    return Encoding.toHEXString(hash(alg, source));
  }
  
  static public String hashString(String alg, String source) throws Exception
  {
    return Encoding.toHEXString(hash(alg, source));
  }
  
  static public String hashString(String alg, InputStream is) throws Exception
  {
    return Encoding.toHEXString(hash(alg, is));
  }
  
  static public String hashString(String alg, StreamInput is) throws Exception
  {
    return Encoding.toHEXString(hash(alg, is));
  }
  
  static public String hashString(byte[] source) throws Exception
  {
    return hashString(DEFAULT, source);
  }
  
  static public String hashString(String source) throws Exception
  {
    return hashString(DEFAULT, source);
  }
  
  static public String hashString(InputStream is) throws Exception
  {
    return hashString(DEFAULT, is);
  }
  
  static public String hashString(StreamInput is) throws Exception
  {
    return hashString(DEFAULT, is);
  }
}
