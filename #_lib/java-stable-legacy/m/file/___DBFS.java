package m.file;

import java.util.*;
import java.sql.*;

import m.object.*;
import m.conf.*;
import m.stream.*;
import m.sql.*;

/*

db/schema/table -> schema/table because jdbc driver requires to connect to a specific db -> one srv registration for each db...
...NB it is possible to create a dbfs with lazy initialization for db and manage the whole path, but i don't care because db are lame

general object data access in fs:
path-to-fs-stream/internal-stream-path-to-data, where internal path is the obj query lang
first problem is how to treat stream? whole obj, stream/list? use casts in path?

if using the find api, instead, there is no query lang as path, but query as options for find command
it depends on the design choice of the service and how to map to apis, eg db srv can map in a way, others can map another way

eg osfs requires a real path and return a json as bytestream
obj-osfs find the deepest file from path and the rest as obj query
dbfs find schema/table from path and the rest as different kind of queries:
column/value -> rest of the columns if remain one column and it is blob then return as bytestream
column1/value1/column2/value2/... -> rest of the columns
#sql-query-inside-table -> must be able to compile sql and detect other schemas/tables -> unpractical!

dbfs.stream schema/table/c1/v1/c2/v2 -> does nothing
on first read execute query and return one row at each read with only remaining columns or bytearray/stream if only one and is blob
-> no each read re/executes the query and return a row stream -> no better the first idea of lazy query
on write obj map is used as data and path as where for update, if none then its an insert
NB db must autorelease connection upon last read -> think!

*/

public class ___DBFS extends ConfigurableWrapper<Pool<Connection>> implements ___FileSystem
{
//  public DBFS() throws Exception
//  {
//  }
  
//  public DBFS(Factory<Connection> factory) throws Exception
//  {
//    super(factory);
//  }
  
//  public void configure(DataObject params) throws Exception
//  {
//    super.configure(params);
//    configure(params.string(Conf.OBJECT));
//  }
//  
//  public void configure(String driver) throws Exception
//  {
//  }
  
  public String root() throws Exception
  {
    return null;
  }
  
  public String path(String path) throws Exception
  {
    return path;
  }
  
  public String file() throws Exception
  {
    throw new Exception();
  }
  
  // attributes
  public Attributes attributes(String path) throws Exception
  {
    throw new Exception();
  }
  
  public void attributes(String path, Attributes attributes) throws Exception
  {
    throw new Exception();
  }
  
  // direct queries
  public boolean exists(String path) throws Exception
  {
    throw new Exception();
  }
  
  public boolean isFile(String path) throws Exception
  {
    return true;
//    throw new Exception();
  }
  
  public boolean isNode(String path) throws Exception
  {
    throw new Exception();
  }
  
  public boolean isSymbolicLink(String path) throws Exception
  {
    throw new Exception();
  }
  
  public String parent(String path) throws Exception
  {
    throw new Exception();
  }
  
  // all object types operations
  public void move(String path, String dest, boolean replace) throws Exception
  {
    throw new Exception();
  }
  
  public void rename(String path, String name) throws Exception
  {
    throw new Exception();
  }
  
  public void copy(String path, String dest, boolean replace, boolean follow) throws Exception
  {
    throw new Exception();
  }
  
  // /db/schema/table:column1='string':column2=number:...
  public void delete(String path, boolean deep) throws Exception
  {
    throw new Exception();
  }
  
  // objects
  // /db/schema/table:column1/type:column2/type:...
  // /db/schema/table:ddl-dml
  public void file(String path) throws Exception
  {
    throw new Exception();
  }
  
  // must:
  // schema/table/column/value or any subset
  // conform to a general query language for objects and collections
  
  // /db/schema/table:sql-query -> cursor stream or read stream in serialized utf8 json format
  // extend bufferbyte as dataobject
  // todo generalize seekable stream where seek is query, or better query is a substream -> view of a seekable stream
  // alternative: each buffer to write is the serialized json (or xml) that represent a list of ops
  // each op is in the form key+data, where inserts have only data and updates have both
  // with this interpretation reads refer to actual data, writes send instructions -> data = f(writtenData)
  // the above is also true for encoded data but in this case bijection of positions are preserved
  public StreamSeekable stream(String path) throws Exception
  {
    return new ___DBFSFileStream(this.object, path(path));
  }
  
  // /db/schema/
  public void node(String path) throws Exception
  {
    throw new Exception();
  }
  
  // /db/schema/
  public void nodes(String path) throws Exception
  {
    throw new Exception();
  }
  
  // /db/schema/table/column/value:column/value:...
  public StreamInput list(String path) throws Exception
  {
    return new ___DBFSFindStream(path(path));
  }
  
  public StreamInput find(String path, Map options) throws Exception
  {
    return new ___DBFSFindStream(path(path), options);
  }
  
  public void link(String path, String dest) throws Exception
  {
    throw new Exception();
  }
  
  public void symlink(String path, String dest) throws Exception
  {
    throw new Exception();
  }
  
  public String symlink(String path) throws Exception
  {
    throw new Exception();
  }
}
