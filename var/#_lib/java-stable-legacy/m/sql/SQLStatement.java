package m.sql;

import java.sql.*;
import java.util.*;

public class SQLStatement
{
  public final static int QUERY_FORMAT_TABLE = 0;
  public final static int QUERY_FORMAT_ROW_MAP = 1;
  public final static int QUERY_FORMAT_COLUMN_ARRAY = 2;
  
  public final static int QUERY_FORMAT_DEFAULT = QUERY_FORMAT_TABLE;
  
  public int format = QUERY_FORMAT_DEFAULT;
  
  public int page = 0;
  public int pageSize = 0;
  
  public List<Integer> types = null;
  public List<String> typeNames = null;
  public Map<String, Integer> fieldTypeMap = null;
  public List<String> fields = null;
  public int numColumns = 0;
  public int totalCount = 0;
  public int savedCount = 0;
  public DataObject data = null;
  
  protected String sql = "";
  protected List<Object> parameters = new ArrayList<>();
  protected List<Integer> parameterTypes = new ArrayList<>();
  protected Connection connection;
  protected PreparedStatement statement;
  protected ResultSet resultSet;
  protected ResultSetMetaData resultSetMetaData;
  protected StreamOutputData out;
  
  public SQLStatement sql(String sql) throws Exception
  {
    if(sql == null)
    {
      throw new Exception();
    }
    
    this.sql = sql;
    
    return this;
  }
  
  public SQLStatement out(StreamOutputData out) throws Exception
  {
    if(out == null)
    {
      throw new Exception();
    }
    
    this.out = out;
    
    return this;
  }
  
  public SQLStatement params(List<Object> parameters) throws Exception
  {
    if(parameters == null)
    {
      throw new Exception();
    }
    
    this.parameters = parameters;
    parameterTypes = null;
    
    return this;
  }
  
  public SQLStatement params(List<Object> parameters, List<Integer> parameterTypes) throws Exception
  {
    if(parameters == null || parameterTypes == null)
    {
      throw new Exception();
    }
    
    this.parameters = parameters;
    this.parameterTypes = parameterTypes;
    
    return this;
  }
  
  public int execute(Connection connection) throws Exception
  {
    if(out == null)
    {
//      out = new StreamOutputDataObject();
//      data = out.object;
      data = new DataObjectBase(new HashMap<String, Object>());
    }
    
    this.connection = connection;
    int res = execute();
    this.connection = null;
    
    return res;
  }
  
  protected int execute() throws Exception
  {
    createStatement();
    try
    {
      executeStatement();
      int res = getResults();
      statement.close();
      return res;
    }
    catch(SQLException e)
    {
      statement.close();
      throw e;
    }
    catch(Exception e)
    {
      statement.close();
      throw e;
    }
  }
  
//  protected void createStatement() throws Exception, SQLException
//  {
//    statement = connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
//  }
//  
//  protected void executeStatement() throws Exception, SQLException
//  {
//    statement.execute(sql);
//  }
  
  protected void createStatement() throws Exception, SQLException
  {
    statement = connection.prepareStatement(sql, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
  }
  
  protected void executeStatement() throws Exception, SQLException
  {
    if(parameters != null)
    {
      if(parameterTypes != null)
      {
        if(parameters.size() != parameterTypes.size())
        {
          throw new Exception();
        }
        
        for(int i = 0; i < parameters.size(); i++)
        {
          statement.setObject(i + 1, parameters.get(i), parameterTypes.get(i));
        }
      }
      else
      {
        for(int i = 0; i < parameters.size(); i++)
        {
          statement.setObject(i + 1, parameters.get(i));
        }
      }
    }
    statement.execute();
  }
  
  protected int getResults() throws Exception, SQLException
  {
    // get number of records inserted/updated/deleted
    savedCount = statement.getUpdateCount();
    
    // get eventual resultset associated with this statement
    resultSet = statement.getResultSet();
    if(resultSet != null)
    {
      getMetaData();
      if(out == null)
      {
        getData();
      }
      else
      {
        getDataStream();
      }
      
      return totalCount;
    }
    else
    {
      return savedCount;
    }
  }
  
  protected void getMetaData() throws Exception, SQLException
  {
    resultSetMetaData = resultSet.getMetaData();
    
//    List<Integer> types = new ArrayList<Integer>();
//    List<String> typeNames = new ArrayList<String>();
//    Map<String, Integer> fieldTypeMap = new LinkedHashMap<String, Integer>();
//    List<String> fields = new ArrayList<String>();
    types = new ArrayList<Integer>();
    typeNames = new ArrayList<String>();
    fieldTypeMap = new LinkedHashMap<String, Integer>();
    fields = new ArrayList<String>();
    
    // get header and types
    numColumns = resultSetMetaData.getColumnCount();
    int ncols = numColumns + 1;
    for(int i = 1; i < ncols; i++)
    {
      types.add(resultSetMetaData.getColumnType(i));
      typeNames.add(resultSetMetaData.getColumnTypeName(i));
      fieldTypeMap.put(resultSetMetaData.getColumnName(i), resultSetMetaData.getColumnType(i));
      fields.add(resultSetMetaData.getColumnName(i));
    }
  }
  
  protected void getData() throws Exception, SQLException
  {
    Map<String, Object> meta = new HashMap<String, Object>();
    
    meta.put("types", types);
    meta.put("typeNames", typeNames);
    meta.put("fieldTypeMap", fieldTypeMap);
    meta.put("fields", fields);
    
    data.set("meta", meta);
    
    // get data
    resultSet.absolute(pageSize * page);
    
    int rowcount = 0;
    int ncols = numColumns + 1;
    
    if(format == QUERY_FORMAT_COLUMN_ARRAY)
    {
      Map<String, List> cols = new LinkedHashMap<String, List>();
      for(int i = 1; i < ncols; i++)
      {
        cols.put(resultSetMetaData.getColumnName(i), new ArrayList());
      }
      while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
      {
        for(int i = 1; i < ncols; i++)
        {
          cols.get(resultSetMetaData.getColumnName(i)).add(resultSet.getString(i));
        }
      }
      data.set("data", cols);
    }
    else if(format == QUERY_FORMAT_ROW_MAP)
    {
      List rows = new ArrayList();
      while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
      {
        Map<String, Object> row = new LinkedHashMap<String, Object>();
        for(int i = 1; i < ncols; i++)
        {
          row.put(resultSetMetaData.getColumnName(i), resultSet.getObject(i));
        }
        rows.add(row);
      }
      data.set("data", rows);
    }
    else
    {
      List rows = new ArrayList();
      while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
      {
        List row = new ArrayList();
        for(int i = 1; i < ncols; i++)
        {
          row.add(resultSet.getObject(i));
        }
        rows.add(row);
      }
      data.set("data", rows);
    }
    
    // get total number of rows
    if(resultSet.last())
    {
      totalCount = resultSet.getRow();
    }
    meta.put("rows", new Integer(totalCount));
  }
  
  protected void getDataStream() throws Exception, SQLException
  {
    Map<String, Object> meta = new HashMap<String, Object>();
    
    meta.put("types", types);
    meta.put("typeNames", typeNames);
    meta.put("fieldTypeMap", fieldTypeMap);
    meta.put("fields", fields);
    
    // get total number of rows
    if(resultSet.last())
    {
      totalCount = resultSet.getRow();
    }
    meta.put("rows", new Integer(totalCount));
    
    out.writeStart();
    out.writeMapStart();
    out.writeMapElementStart("meta");
    out.write(meta);
    out.writeMapElementEnd("meta");
    out.writeMapElementSeparator();
    out.writeMapElementStart("data");
    
    // get data
    resultSet.absolute(pageSize * page);
    
    if(format == QUERY_FORMAT_COLUMN_ARRAY)
    {
      getDataFormatColumnArray();
    }
    else if(format == QUERY_FORMAT_ROW_MAP)
    {
      getDataFormatRowMap();
    }
    else
    {
      getDataFormatTable();
    }
    
    out.writeMapElementEnd("data");
    out.writeMapEnd();
    out.writeEnd();
  }
  
  protected void getDataFormatTable() throws Exception, SQLException
  {
    int rowcount = 0;
    int ncols = numColumns + 1;
    
    out.writeListStart();
    
    if(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
    {
//      List<String> row = new ArrayList<String>();
      List row = new ArrayList();
      for(int i = 1; i < ncols; i++)
      {
//        row.add(resultSet.getString(i));
        row.add(resultSet.getObject(i));
      }

      out.writeListElementStart();
      out.write(row);
      out.writeListElementEnd();
    }
    
    while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
    {
//      List<String> row = new ArrayList<String>();
      List row = new ArrayList();
      for(int i = 1; i < ncols; i++)
      {
//        row.add(resultSet.getString(i));
        row.add(resultSet.getObject(i));
      }

      out.writeListElementSeparator();
      out.writeListElementStart();
      out.write(row);
      out.writeListElementEnd();
    }
    
    out.writeListEnd();
  }
  
  protected void getDataFormatColumnArray() throws Exception, SQLException
  {
    int rowcount = 0;
    int ncols = numColumns + 1;
    
//    Map<String, List<String>> data = new LinkedHashMap<String, List<String>>();
    Map<String, List> data = new LinkedHashMap<String, List>();
    for(int i = 1; i < ncols; i++)
    {
//      data.put(resultSetMetaData.getColumnName(i), new ArrayList<String>());
      data.put(resultSetMetaData.getColumnName(i), new ArrayList());
    }
    while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
    {
      for(int i = 1; i < ncols; i++)
      {
        data.get(resultSetMetaData.getColumnName(i)).add(resultSet.getString(i));
      }
    }
    
    out.write(data);
  }
  
  protected void getDataFormatRowMap() throws Exception, SQLException
  {
    int rowcount = 0;
    int ncols = numColumns + 1;
    
    out.writeListStart();
    
    if(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
    {
//      Map<String, String> row = new LinkedHashMap<String, String>();
      Map<String, Object> row = new LinkedHashMap<String, Object>();
      for(int i = 1; i < ncols; i++)
      {
//        row.put(resultSetMetaData.getColumnName(i), resultSet.getString(i));
        row.put(resultSetMetaData.getColumnName(i), resultSet.getObject(i));
      }

      out.writeListElementStart();
      out.write(row);
      out.writeListElementEnd();
    }
    
    while(resultSet.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
    {
//      Map<String, String> row = new LinkedHashMap<String, String>();
      Map<String, Object> row = new LinkedHashMap<String, Object>();
      for(int i = 1; i < ncols; i++)
      {
//        row.put(resultSetMetaData.getColumnName(i), resultSet.getString(i));
        row.put(resultSetMetaData.getColumnName(i), resultSet.getObject(i));
      }

      out.writeListElementSeparator();
      out.writeListElementStart();
      out.write(row);
      out.writeListElementEnd();
    }
    
    out.writeListEnd();
  }
}
