package m.util;

import java.io.*;
import java.math.*;
import java.net.*;
import java.util.*;

public class IPAddress
{
  static private final long IP_0_255_255_255 = 16777215;
  static private final long IP_10_0_0_0 = 167772160;
  static private final long IP_10_255_255_255 = 184549375;
  static private final long IP_127_0_0_0 = 2130706432;
  static private final long IP_127_255_255_255 = 2147483647;
  static private final long IP_169_254_0_0 = 2851995648L;
  static private final long IP_169_254_255_255 = 2852061183L;
  static private final long IP_172_16_0_0 = 2886729728L;
  static private final long IP_172_31_255_255 = 2887778303L;
  static private final long IP_192_0_2_0 = 3221225984L;
  static private final long IP_192_0_2_255 = 3221226239L;
  static private final long IP_192_88_99_0 = 3221226239L;
  static private final long IP_192_88_99_255 = 3227018239L;
  static private final long IP_192_168_0_0 = 3232235520L;
  static private final long IP_192_168_255_255 = 3232301055L;
  static private final long IP_198_18_0_0 = 3323068416L;
  static private final long IP_198_19_255_255 = 3323199487L;
  static private final long IP_224_0_0_0 = 3758096384L;
  static private final long IP_239_255_255_255 = 4026531839L;
  static private final long IP_240_0_0_0 = 4026531840L;
  static private final long IP_255_255_255_255 = 4294967295L;
  
  static private final String IP_CLASS_THIS_HOST = "host";
  static private final String IP_CLASS_LOOPBACK = "loopback";
  static private final String IP_CLASS_LINK_LOCAL = "link-local";
  static private final String IP_CLASS_MULTICAST = "multicast";
  static private final String IP_CLASS_RESERVED = "reserved";
  static private final String IP_CLASS_PRIVATE = "private";
  static private final String IP_CLASS_PRIVATE_A = "private-A";
  static private final String IP_CLASS_PRIVATE_B = "private-B";
  static private final String IP_CLASS_PRIVATE_C = "private-C";
  static private final String IP_CLASS_PUBLIC = "public";
  
  static public long ipV4ToLong(String ipString) throws Exception
  {
    String[] octets = ipString.split("\\.");
    
    long result = 0;
    for(String octet: octets)
    {
      result <<= 8;
      result |= Long.parseLong(octet) & 0xff;
    }
    
    return result;
  }
  
  static public String longToIPV4(long ip) throws Exception
  {
    return ((ip >> 24) & 0xff) + "." + ((ip >> 16) & 0xff) + "." + ((ip >> 8) & 0xff) + "." + (ip & 0xff);
  }
  
  static public BigInteger ipV6ToNumber(String ipString) throws Exception
  {
    InetAddress address = InetAddress.getByName(ipString);
    byte[] bytes = address.getAddress();
    
    return new BigInteger(1, bytes);
  }
  
  static public String numberToIPV6(BigInteger ip) throws Exception
  {
    BigInteger ipNumber = ip;
    String ipString = "";
    BigInteger a = new BigInteger("FFFF", 16);
    
    for(int i = 0; i < 8; i++)
    {
      ipString = ipNumber.and(a).toString(16) + ":" + ipString;
      ipNumber = ipNumber.shiftRight(16);
    }
    
    return ipString.substring(0, ipString.length() - 1);
  }
  
  static public List<String> ipV4RangeToNetMask(long ipStart, long ipEnd) throws Exception
  {
    if(ipStart > ipEnd)
    {
      throw new Exception();
    }
    
    long start = ipStart;
    long end = ipEnd;
    int[] CIDR2MASK = new int[]{0x00000000, 0x80000000, 0xC0000000, 0xE0000000, 0xF0000000, 0xF8000000, 0xFC000000, 0xFE000000, 0xFF000000, 0xFF800000, 0xFFC00000, 0xFFE00000, 0xFFF00000, 0xFFF80000, 0xFFFC0000, 0xFFFE0000, 0xFFFF0000, 0xFFFF8000, 0xFFFFC000, 0xFFFFE000, 0xFFFFF000, 0xFFFFF800, 0xFFFFFC00, 0xFFFFFE00, 0xFFFFFF00, 0xFFFFFF80, 0xFFFFFFC0, 0xFFFFFFE0, 0xFFFFFFF0, 0xFFFFFFF8, 0xFFFFFFFC, 0xFFFFFFFE, 0xFFFFFFFF};
    
    ArrayList<String> cidrs = new ArrayList<String>();
    while(end >= start)
    {
      byte maxsize = 32;
      while(maxsize > 0)
      {
        long mask = CIDR2MASK[maxsize - 1];
        long maskedBase = start & mask;
        if(maskedBase != start)
        {
          break;
        }
        maxsize--;
      }
      
      double x = Math.log(end - start + 1) / Math.log(2);
      byte maxdiff = (byte)(32 - Math.floor(x));
      if(maxsize < maxdiff)
      {
        maxsize = maxdiff;
      }
      String ip = longToIPV4(start);
      cidrs.add(ip + "/" + maxsize);
      start += Math.pow(2, (32 - maxsize));
    }
    
    return cidrs;
  }
  
  static public List<String> ipV4RangeToNetMask(String ipStart, String ipEnd) throws Exception
  {
    return ipV4RangeToNetMask(ipV4ToLong(ipStart), ipV4ToLong(ipEnd));
  }
  
  static public boolean ipV4NetMaskMatch(long ip, String netMask) throws Exception
  {
    String[] netMaskParts = netMask.split("/");
    long maskIP = ipV4ToLong(netMaskParts[0]);
    int maskBits = Integer.parseInt(netMaskParts[1]);
    
    long maskIPMasked = (maskIP >> maskBits) << maskBits;
    long ipMasked = (ip >> maskBits) << maskBits;
    boolean result = ipMasked == maskIPMasked;
    
    return result;
  }
  
  static public boolean ipV4NetMaskMatch(String ipString, String netMask) throws Exception
  {
    return ipV4NetMaskMatch(ipV4ToLong(ipString), netMask);
  }
  
  static public String ipV4Class(long ip) throws Exception
  {
    String ipClass = IP_CLASS_PUBLIC;
    
    if(0 <= ip && ip < IP_0_255_255_255)
    {
      ipClass = IP_CLASS_THIS_HOST;
    }
    else if(ip < IP_10_0_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_10_255_255_255)
    {
      ipClass = IP_CLASS_PRIVATE_A;
    }
    else if(ip < IP_127_0_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_127_255_255_255)
    {
      ipClass = IP_CLASS_LOOPBACK;
    }
    else if(ip < IP_169_254_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_169_254_255_255)
    {
      ipClass = IP_CLASS_LINK_LOCAL;
    }
    else if(ip < IP_172_16_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_172_31_255_255)
    {
      ipClass = IP_CLASS_PRIVATE_B;
    }
    else if(ip < IP_192_0_2_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_192_0_2_255)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip < IP_192_88_99_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_192_88_99_255)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip < IP_192_168_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_192_168_255_255)
    {
      ipClass = IP_CLASS_PRIVATE_C;
    }
    else if(ip < IP_198_18_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_198_19_255_255)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip < IP_224_0_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_239_255_255_255)
    {
      ipClass = IP_CLASS_MULTICAST;
    }
    else if(ip < IP_240_0_0_0)
    {
//      ipClass = "AAAAAAAAAAAAAAAA";
    }
    else if(ip <= IP_255_255_255_255)
    {
      ipClass = IP_CLASS_RESERVED;
    }
    else
    {
      throw new Exception();
    }
    
    return ipClass;
  }
  
  static public String ipV4Class(String ipString) throws Exception
  {
    return ipV4Class(ipV4ToLong(ipString));
  }
  
  static public String ipV6Class(String ipString) throws Exception
  {
    InetAddress address = InetAddress.getByName(ipString);
    
    String ipClass = IP_CLASS_PUBLIC;
    
//    if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_THIS_HOST;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_PRIVATE;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_PUBLIC;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_LOOPBACK;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_LINK_LOCAL;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_MULTICAST;
//    }
//    else if(address.isAnyLocalAddress())
//    {
//      ipClass = IP_CLASS_RESERVED;
//    }
//    else
//    {
//      throw new Exception();
//    }
    
    return ipClass;
  }
  
  static public String ipClass(String ipString) throws Exception
  {
    if(-1 < ipString.indexOf("."))
    {
      return ipV4Class(ipString);
    }
    else
    {
      return ipV6Class(ipString);
    }
  }
  
  static public String ipGeoLocation(String ipString, String csvFile) throws Exception
  {
    String ipClass = ipClass(ipString);
    if(!ipClass.startsWith("public"))
    {
      return ipClass;
    }
    
    String location = "";
    BufferedReader reader = new BufferedReader(new FileReader(csvFile));
    String line = reader.readLine();
    String[] lineSplitted = line.split(",");
    long ip = ipV4ToLong(ipString);
    long ipStart = ipV4ToLong(lineSplitted[0]);
    long ipEnd = ipV4ToLong(lineSplitted[1]);
    while(!(ipStart <= ip && ip <= ipEnd))
    {
      line = reader.readLine();
      lineSplitted = line.split(",");
      ipStart = ipV4ToLong(lineSplitted[0]);
      ipEnd = ipV4ToLong(lineSplitted[1]);
    }
    location = line;
    reader.close();

    if(line == null)
    {
      location = "location/unknown";
    }
    else
    {
      lineSplitted = location.split(",");
      location = "location/" + lineSplitted[2];
      if(5 < lineSplitted.length)
      {
        location += "/" + lineSplitted[3] + "/" + lineSplitted[4] + "/" + lineSplitted[5];
      }
    }
    
    return ipClass + "/" + location;
  }
}
