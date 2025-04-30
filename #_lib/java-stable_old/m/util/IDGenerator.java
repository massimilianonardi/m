package m.util;

import java.text.*;
import java.util.*;

public class IDGenerator
{
  protected Random rnd = new Random();
  
  protected int maxRandomSuffix = 1000000;
  protected SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
  protected String dateFormatRandomSeparator = "_";
  
  public IDGenerator maxRandomSuffix(int maxRandomSuffix) throws Exception
  {
    this.maxRandomSuffix = maxRandomSuffix;
    
    return this;
  }
  
  public IDGenerator dateFormat(String dateFormat) throws Exception
  {
    this.dateFormat = new SimpleDateFormat(dateFormat);
    
    return this;
  }
  
  public IDGenerator dateFormatRandomSeparator(String dateFormatRandomSeparator) throws Exception
  {
    this.dateFormatRandomSeparator = dateFormatRandomSeparator;
    
    return this;
  }
  
  public String uuid() throws Exception
  {
    return UUID.randomUUID().toString();
  }
  
  public String random() throws Exception
  {
    return ("" + (rnd.nextInt(maxRandomSuffix) + maxRandomSuffix)).substring(1);
  }
  
  public String date() throws Exception
  {
    return dateFormat.format(new Date());
  }
  
  public String date(int days) throws Exception
  {
    Calendar calendar = Calendar.getInstance();
    calendar.add(Calendar.DATE, days);
    
    return dateFormat.format(calendar.getTime());
  }
  
  public String dateRandom() throws Exception
  {
    return date() + dateFormatRandomSeparator + random();
  }
  
  public String dateRandom(int days) throws Exception
  {
    return date(days) + dateFormatRandomSeparator + random();
  }
}
