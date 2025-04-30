package m.file;

import java.io.*;
import java.nio.*;
import java.nio.file.attribute.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;
import java.sql.*;

import m.object.*;
import m.stream.*;
import m.sql.*;

public class ___DBFSFileStream implements StreamSeekable
{
  protected String path;
  protected Pool<Connection> pool;
  protected RandomAccessFile file;
  protected Obj buffer;
  protected boolean eos = false;
  
  protected ___DBFSFileStream() throws Exception
  {
  }
  
  public ___DBFSFileStream(Pool<Connection> pool, String filePath) throws Exception
  {
    this(pool, filePath, ByteArray.DEFAULT);
  }
  
  public ___DBFSFileStream(Pool<Connection> pool, String filePath, int bufferSize) throws Exception
  {
//    buffer = new BufferByte(bufferSize);
    path = Paths.get(filePath).normalize().toString();
    this.pool = pool;
    open();
  }
  
  public void open() throws Exception
  {
    buffer = new Obj();
//    file = new RandomAccessFile(path.toString(), "rws");
    System.out.println("m.file.DBFSFileStream.open() - PATH: " + path);
  }
  
  public void close() throws Exception
  {
    file.close();
    file = null;
  }
  
  public boolean isOpen() throws Exception
  {
    return file != null;
  }
  
  public void begin() throws Exception
  {
    file.getChannel().position(0);
  }
  
  public void end() throws Exception
  {
    file.getChannel().position(file.getChannel().size());
  }
  
  public long size() throws Exception
  {
    return file.getChannel().size();
  }
  
  public long position() throws Exception
  {
    return file.getChannel().position();
  }
  
  public void position(long position) throws Exception
  {
    file.getChannel().position(position);
  }
  
  public void seek(long seek) throws Exception
  {
    file.getChannel().position(file.getChannel().position() + seek);
  }
  
  public void size(long size) throws Exception
  {
    file.getChannel().truncate(size);
  }
  
  public boolean eos() throws Exception
  {
    if(eos)
    {
      return true;
    }
    else
    {
      eos = true;
      return false;
    }
  }
  
//  public void skip(long skip) throws Exception
//  {
//    seek(skip);
//  }
  
  public Obj readObj() throws Exception
  {
//    buffer.length(file.read(buffer.buffer()));
//    if(buffer.length() == -1)
//    {
//      eos = true;
//    }
    return buffer;
  }
  
  public void write(ByteArray buffer) throws Exception
  {
//    file.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
  
  public void write(Obj buffer) throws Exception
  {
//    file.write(buffer.buffer(), buffer.offset(), buffer.length());
  }
  
  public ByteArray readBytes() throws Exception
  {
    SQLCommandHelper sqlh = new SQLCommandHelper();
//    sqlh.select(path, cols);
    sqlh.select(path);
//    sqlh.where(fieldTypeMap, where, false);
//    sqlh.order(order, versus);
    SQLStatement sql = new SQLStatement().sql(sqlh.statement);
    
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    StreamOutputDataJSON sod = new StreamOutputDataJSON(baos);
    execute(sql, sod);
    ByteArray b = new ByteArray(baos.toByteArray());
    buffer.set(b);
    
    return readObj().bytes();
  }
  
  public SQLStatement execute(SQLStatement sql) throws Exception
  {
    Connection c = pool.acquire();
    try
    {
      sql.execute(c);
      if(!c.getAutoCommit())
      {
        c.commit();
      }
    }
    catch(Exception e)
    {
      pool.release(c);
      throw e;
    }
    pool.release(c);
    
    return sql;
  }
  
  public SQLStatement execute(SQLStatement sql, StreamOutputData sod) throws Exception
  {
    Connection c = pool.acquire();
    try
    {
      sql.out(sod).execute(c);
      if(!c.getAutoCommit())
      {
        c.commit();
      }
    }
    catch(Exception e)
    {
      pool.release(c);
      throw e;
    }
    pool.release(c);
    
    return sql;
  }
  
  public List<SQLStatement> execute(List<SQLStatement> commands, StreamOutputData sod) throws Exception
  {
    return execute(commands, sod, false, false);
  }
  
  public List<SQLStatement> execute(List<SQLStatement> commands, StreamOutputData sod, boolean transaction, boolean tryAll) throws Exception
  {
    Connection c = pool.acquire();
    boolean autoCommit = c.getAutoCommit();
    if(transaction)
    {
      // set transaction isolation
//      c.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
      c.setAutoCommit(false);
    }
    try
    {
      sod.writeListElementStart();
      for(int i = 0; i < commands.size(); i++)
      {
        try
        {
          commands.get(i).out(sod).execute(c);
          sod.writeListElementSeparator();
        }
        catch(Exception e)
        {
          if(!tryAll)
          {
//            throw e;
          }
        }
      }
      sod.writeListElementEnd();
    }
    catch(Exception e)
    {
      if(transaction)
      {
        c.rollback();
        c.setAutoCommit(autoCommit);
      }
      pool.release(c);
//      throw e;
    }
    if(transaction)
    {
      c.commit();
      c.setAutoCommit(autoCommit);
    }
    pool.release(c);
    
    return commands;
  }
}
