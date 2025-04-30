package m.sql;

import java.util.*;

public class SQLCommandHelper extends SQLCommand
{
  public SQLCommandHelper()
  {
  }
  
  public SQLStatement getSQLStatement()
  {
    SQLStatement sql = new SQLStatement();
    sql.sql = statement;
    sql.parameters = parameters;
    sql.parameterTypes = sqltypes;
    sql.fieldTypeMap = fieldTypeMap;
    
    return sql;
  }
  
  public SQLCommandHelper page(int page)
  {
    this.page = page;
    
    return this;
  }
  
  public SQLCommandHelper paging(int pageSize)
  {
    this.pageSize = pageSize;
    
    return this;
  }
  
  public SQLCommandHelper format(int format)
  {
    this.format = format;
    
    return this;
  }
  
  public SQLCommandHelper prepare(String preparedSQL, Object[] params)
  {
    return prepare(preparedSQL, Arrays.asList(params));
  }
  
  public SQLCommandHelper prepare(String preparedSQL, List<Object> params)
  {
    this.statement = preparedSQL;
    
    if(this.sqltypes == null)
    {
      this.sqltypes = new ArrayList<Integer>();
    }
    
    if(this.parameters == null)
    {
      this.parameters = new ArrayList<Object>();
    }
    
    Iterator<Object> fieldIterator = params.iterator();
    while(fieldIterator.hasNext())
    {
      Object value = fieldIterator.next();
      Integer type = java.sql.Types.VARCHAR;
      
      this.sqltypes.add(type);
      this.parameters.add(value == null ? null : value.toString());
    }
    
    return this;
  }
  
  public SQLCommandHelper select(String table)
  {
    this.statement += "select * from " + table;
    
    return this;
  }
  
  public SQLCommandHelper select(String table, List<String> cols)
  {
    String res = "select ";
    
    if(cols != null && 0 < cols.size())
    {
      for(int i = 0; i < cols.size() - 1; i++)
      {
        res += cols.get(i) + ", ";
      }
      res += cols.get(cols.size() - 1);
    }
    else
    {
      res += "*";
    }
    
    res += " from " + table;
    
    this.statement += res;
    
    return this;
  }
  
  public SQLCommandHelper order(List<String> order, List<String> versus)
  {
    String res = "";
    
    if(order != null && versus != null)
    {
      if(order.size() == versus.size() && 0 < order.size())
      {
        res += " order by ";
        for(int i = 0; i < order.size(); i++)
        {
          res += order.get(i) + " " + versus.get(i) + ", ";
        }
        if(0 < res.length())
        {
          res = res.substring(0, res.length() - 2);
        }
      }
    }
    
    this.statement += res;
    
    return this;
  }
  
  public SQLCommandHelper where(Map<String, Integer> types, Map<String, Object> where, boolean conditionsOnly)
  {
    if(types == null || types.isEmpty() || where == null || where.isEmpty())
    {
      return this;
    }
    
    String res = "";
    
    if(!conditionsOnly)
    {
      res += " where ";
    }
    
    Iterator<String> fieldIterator = where.keySet().iterator();
    while(fieldIterator.hasNext())
    {
      String key = fieldIterator.next();
      Object value = where.get(key);
      Integer type = types.get(key);
      
      if(type == null)
      {
        // raw condition
        res += "(" + key + ") and ";
      }
      else if(value == null)
      {
        // is null condition
        res += "" + key + " is null and ";
      }
      else
      {
        // equality condition
        this.sqltypes.add(type);
        this.parameters.add(value);
        res += "" + key + "=? and ";
      }
    }
    
    this.statement += res.substring(0, res.length() - 5);
    
    return this;
  }
  
  public SQLCommandHelper where(Map<String, Integer> types, List where, boolean conditionsOnly)
  {
    if(types == null || types.isEmpty() || where == null || where.isEmpty())
    {
      return this;
    }
    
    String res = "";
    
    if(!conditionsOnly)
    {
      res += " where ";
    }
    
    this.statement += res + getWhere(where, types, this.sqltypes, this.parameters);
    
    return this;
  }
  
  protected static String getWhere(List where, Map<String, Integer> types, List<Integer> sqltypes, List<Object> params)
  {
    if(where.size() == 0)
    {
      return "";
    }
    
    // generic sql condition
    if(where.size() == 1)
    {
      return (String) where.get(0);
    }
    
    // process complex operations
    String op = (String) where.get(0);
    if(where.size() == 2 && "not".equals(op.toLowerCase()))
    {
      String val1 = getWhere((List) where.get(1), types, sqltypes, params);
      return " " + op + " (" + val1 + ")";
    }
    else if(where.size() > 2 && ("and".equals(op.toLowerCase()) || "or".equals(op.toLowerCase())))
    {
      String val1 = getWhere((List) where.get(1), types, sqltypes, params);
      String whereCondition = " (" + val1 + ") ";
      for(int i = 2; i < where.size(); i++)
      {
        String val = getWhere((List) where.get(i), types, sqltypes, params);
        whereCondition += " " + op + " (" + val + ")";
      }
      return whereCondition;
    }
    // support simple binary column operations 
    else if(where.size() == 3 && ("=".equals(op) || "<>".equals(op) || "<".equals(op) || ">".equals(op) || "<=".equals(op) || ">=".equals(op) || "like".equals(op.toLowerCase())))
    {
      String val1 = (String) where.get(1);
      String val2 = (String) where.get(2);
//      if(val2 == null || "null".equals(val2))
      if(val2 == null)
      {
        if("=".equals(op))
        {
          return val1 + " is null";
        }
        else if("<>".equals(op))
        {
          return val1 + " is not null";
        }
      }
      sqltypes.add(types.get(val1));
      params.add(val2);
//      return " " + val1 + " " + op + " " + "?";
      return val1 + " " + op + " " + "?";
    }
    
    return "";
  }
  
  public SQLCommandHelper save(String table, Map<String, Integer> types, Map<String, Object> keys, Map<String, Object> data)
  {
    boolean isKeysValid = keys != null && !keys.isEmpty();
    boolean isDataValid = data != null && !data.isEmpty();
    
    if(isKeysValid && isDataValid)
    {
      update(table, types, keys, data);
    }
    else if(!isKeysValid && isDataValid)
    {
      insert(table, types, data);
    }
    else if(isKeysValid && !isDataValid)
    {
      delete(table, types, keys);
    }
    
    return this;
  }
  
  public SQLCommandHelper insert(String table, Map<String, Integer> types, Map<String, Object> data)
  {
    if(types == null || types.isEmpty() || data == null || data.isEmpty())
    {
      return this;
    }
    
    String res = "insert into " + table + " (";
    String values = ") values (";
    
    Iterator<String> fieldIterator = data.keySet().iterator();
    while(fieldIterator.hasNext())
    {
      String key = fieldIterator.next();
      Object value = data.get(key);
      Integer type = types.get(key);
      
      this.sqltypes.add(type);
      this.parameters.add(value);
      res += key + ",";
//      values += value + ",";
      values += "?,";
    }
    
    this.statement += res.substring(0, res.length() - 1) + values.substring(0, values.length() - 1) + ")";
    
    return this;
  }
  
  public SQLCommandHelper update(String table, Map<String, Integer> types, Map<String, Object> keys, Map<String, Object> data)
  {
    if(types == null || types.isEmpty() || keys == null || keys.isEmpty() || data == null || data.isEmpty())
    {
      return this;
    }
    
    String res = "update " + table + " set ";
    
    Iterator<String> fieldIterator = data.keySet().iterator();
    while(fieldIterator.hasNext())
    {
      String key = fieldIterator.next();
      Object value = data.get(key);
      Integer type = types.get(key);
      
      this.sqltypes.add(type);
      this.parameters.add(value);
      res += key + "=?,";
    }
    
    this.statement += res.substring(0, res.length() - 1);
    
    where(types, keys, false);
    
    return this;
  }
  
  public SQLCommandHelper delete(String table)
  {
    this.statement += "delete from " + table;
    
    return this;
  }
  
  public SQLCommandHelper delete(String table, Map<String, Integer> types, Map<String, Object> keys)
  {
    delete(table);
    where(types, keys, false);
    
    return this;
  }
  
  public SQLCommandHelper limit(int limit)
  {
    this.statement += " limit " + limit;
    
    return this;
  }
}
