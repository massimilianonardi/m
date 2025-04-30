package m.sql;

import java.util.*;
import java.sql.*;

public class SQLCommand
{
  public final static int QUERY_FORMAT_TABLE = 0;
  public final static int QUERY_FORMAT_ROW_MAP = 1;
  public final static int QUERY_FORMAT_COLUMN_ARRAY = 2;
  
  public final static int QUERY_FORMAT_DEFAULT = QUERY_FORMAT_TABLE;
  
  public int format = QUERY_FORMAT_DEFAULT;
  
  public String statement = "";
  
  public int page = 0;
  public int pageSize = 0;
  
  protected List<Integer> sqltypes = new ArrayList<>();
  protected List<Object> parameters = new ArrayList<>();
  
  public List<Integer> types = null;
  public List<String> typeNames = null;
  public Map<String, Integer> fieldTypeMap = null;
  public List<String> fields = null;
  public Object data = null;
  public int totalCount = 0;
  public int savedCount = 0;
  public int sqlCode = 0;
  public String exceptionMessage = null;
  
  public SQLCommand()
  {
  }
  
  public SQLCommand(String statement)
  {
    this.statement = statement;
  }
  
  public List<List<String>> getDataFormatTable()
  {
    return (List<List<String>>) this.data;
  }
  
  public List<Map<String, String>> getDataFormatRowMap()
  {
    return (List<Map<String, String>>) this.data;
  }
  
  public Map<String, List<String>> getDataFormatColumnArray()
  {
    return (Map<String, List<String>>) this.data;
  }
  
//  public void execute(Connection connection) throws Exception, SQLException
//  {
//    DataStreamOutputObject dso = new DataStreamOutputObject();
//    execute(connection, dso);
//    this.data = dso.get();
//  }
  
  public void execute(Connection connection) throws Exception, SQLException
  {
    PreparedStatement ps = connection.prepareStatement(this.statement, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
    
    try
    {
      if(this.parameters != null && this.sqltypes != null)
      {
        for(int i = 0; i < this.parameters.size(); i++)
        {
          ps.setObject(i + 1, this.parameters.get(i), this.sqltypes.get(i));
        }
      }
      ps.execute();
      getResults(ps);
      
      ps.close();
    }
    catch(SQLException e)
    {
      this.sqlCode = e.getErrorCode();
      this.exceptionMessage = e.getMessage();
      ps.close();
      throw e;
    }
    catch(Exception e)
    {
      this.sqlCode = 0;
      this.exceptionMessage = e.getMessage();
      ps.close();
      throw e;
    }
  }
  
  public void execute(Connection connection, StreamOutputData sod) throws Exception, SQLException
  {
    PreparedStatement ps = connection.prepareStatement(this.statement, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
    
    try
    {
      if(this.parameters != null && this.sqltypes != null)
      {
        for(int i = 0; i < this.parameters.size(); i++)
        {
          ps.setObject(i + 1, this.parameters.get(i), this.sqltypes.get(i));
        }
      }
      ps.execute();
      getResults(sod, ps, page, pageSize);
      
      ps.close();
    }
    catch(SQLException e)
    {
      this.sqlCode = e.getErrorCode();
      this.exceptionMessage = e.getMessage();
      ps.close();
      throw e;
    }
    catch(Exception e)
    {
      this.sqlCode = 0;
      this.exceptionMessage = e.getMessage();
      ps.close();
      throw e;
    }
  }
  
  protected void getResults(StreamOutputData sod, PreparedStatement statement, int page, int pageSize) throws Exception, SQLException
  {
    totalCount = 0;
    savedCount = 0;
    
    // get number of records inserted/updated/deleted
    savedCount = statement.getUpdateCount();

    // get eventual resultset associated with this statement
    ResultSet rs = statement.getResultSet();
    if(rs != null)
    {
      List<Integer> types = new ArrayList<Integer>();
      List<String> typeNames = new ArrayList<String>();
      Map<String, Integer> fieldTypeMap = new LinkedHashMap<String, Integer>();
      List<String> fields = new ArrayList<String>();

      // get header and types
      ResultSetMetaData rsmd = rs.getMetaData();
      int ncols = rsmd.getColumnCount();
      for(int i = 1; i < ncols + 1; i++)
      {
        types.add(rsmd.getColumnType(i));
        typeNames.add(rsmd.getColumnTypeName(i));
        fieldTypeMap.put(rsmd.getColumnName(i), rsmd.getColumnType(i));
        fields.add(rsmd.getColumnName(i));
      }
      
      Map<String, Object> meta = new HashMap<String, Object>();
      
      meta.put("types", types);
      meta.put("typeNames", typeNames);
      meta.put("fieldTypeMap", fieldTypeMap);
      meta.put("fields", fields);
      
      sod.writeStart();
      sod.writeMapStart();
      sod.writeMapElementStart("meta");
      sod.write(meta);
      sod.writeMapElementEnd("meta");
      sod.writeMapElementSeparator();
      sod.writeMapElementStart("data");
      sod.writeListStart();

      // get data
      rs.absolute(pageSize * page);
      int rowcount = 0;
      
      if(rs.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
      {
        List<String> row = new ArrayList<String>();
        for(int i = 1; i < ncols + 1; i++)
        {
          row.add(rs.getString(i));
        }
        
        sod.writeListElementStart();
        sod.write(row);
        sod.writeListElementEnd();
      }
      
      while(rs.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
      {
        List<String> row = new ArrayList<String>();
        for(int i = 1; i < ncols + 1; i++)
        {
          row.add(rs.getString(i));
        }
        
        sod.writeListElementSeparator();
        sod.writeListElementStart();
        sod.write(row);
        sod.writeListElementEnd();
      }

      // get total number of rows
      if(rs.last())
      {
        totalCount = rs.getRow();
      }
      
      Map<String, Object> status = new HashMap<String, Object>();
      
      status.put("savedCount", new Integer(savedCount));
      status.put("totalCount", new Integer(totalCount));
      
      sod.writeListEnd();
      sod.writeMapElementEnd("data");
      sod.writeMapElementSeparator();
      sod.writeMapElementStart("status");
      sod.write(status);
      sod.writeMapElementEnd("status");
      sod.writeMapEnd();
      sod.writeEnd();
    }
  }
  
  protected void getResults(Statement statement) throws Exception, SQLException
  {
    // get number of records inserted/updated/deleted
    this.savedCount = statement.getUpdateCount();

    // get eventual resultset associated with this statement
    ResultSet rs = statement.getResultSet();
    if(rs != null)
    {
      this.types = new ArrayList<Integer>();
      this.typeNames = new ArrayList<String>();
      this.fieldTypeMap = new LinkedHashMap<String, Integer>();
      this.fields = new ArrayList<String>();

      // get header and types
      ResultSetMetaData rsmd = rs.getMetaData();
      int ncols = rsmd.getColumnCount();
      for(int i = 1; i < ncols + 1; i++)
      {
        this.types.add(rsmd.getColumnType(i));
        this.typeNames.add(rsmd.getColumnTypeName(i));
        this.fieldTypeMap.put(rsmd.getColumnName(i), rsmd.getColumnType(i));
        this.fields.add(rsmd.getColumnName(i));
      }

      // get data
      rs.absolute(pageSize * page);
      int rowcount = 0;
      if(this.format == QUERY_FORMAT_COLUMN_ARRAY)
      {
        Map<String, List<String>> data = new LinkedHashMap<String, List<String>>();
        this.data = data;
        for(int i = 1; i < ncols + 1; i++)
        {
          data.put(rsmd.getColumnName(i), new ArrayList<String>());
        }
        while(rs.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
        {
          List<String> row = new ArrayList<String>();
          for(int i = 1; i < ncols + 1; i++)
          {
            data.get(rsmd.getColumnName(i)).add(rs.getString(i));
          }
        }
      }
      else if(this.format == QUERY_FORMAT_ROW_MAP)
      {
        List<Map<String, String>> data = new ArrayList<Map<String, String>>();
        this.data = data;
        while(rs.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
        {
          Map<String, String> row = new LinkedHashMap<String, String>();
          for(int i = 1; i < ncols + 1; i++)
          {
            row.put(rsmd.getColumnName(i), rs.getString(i));
          }
          data.add(row);
        }
      }
      else
      {
        List<List<String>> data = new ArrayList<List<String>>();
        this.data = data;
        while(rs.next() && ((pageSize == 0) || (rowcount++ < pageSize)))
        {
          List<String> row = new ArrayList<String>();
          for(int i = 1; i < ncols + 1; i++)
          {
            row.add(rs.getString(i));
          }
          data.add(row);
        }
      }

      // get total number of rows
      if(rs.last())
      {
        this.totalCount = rs.getRow();
      }
    }
  }
}
