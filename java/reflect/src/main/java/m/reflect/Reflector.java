package m.reflect;

import java.lang.reflect.*;
import java.util.*;

public class Reflector
{
  protected Class classObject;
  protected Object object = null;

  public Reflector(Object object) throws Exception
  {
    this.object = object;
    classObject = object.getClass();
  }

  public Reflector(String className) throws Exception
  {
    classObject = Class.forName(className);
    Constructor constructor = classObject.getConstructor();
    object = constructor.newInstance();
  }

  public Reflector(String className, boolean construct) throws Exception
  {
    classObject = Class.forName(className);
    if(construct)
    {
      Constructor constructor = classObject.getConstructor();
      object = constructor.newInstance();
    }
  }

  public Reflector(String className, Class[] parameterTypes, Object... args) throws Exception
  {
    init(className, parameterTypes, args);
  }

  public Reflector(String className, String[] parameterTypes, Object... args) throws Exception
  {
    init(className, getClasses(parameterTypes), args);
  }

  public Reflector(String className, List<String> parameterTypes, List<Object> args) throws Exception
  {
    init(className, getClasses(parameterTypes), getObjects(args));
  }

  protected void init(String className, Class[] parameterTypes, Object... args) throws Exception
  {
    classObject = Class.forName(className);
    Constructor constructor = classObject.getConstructor(parameterTypes);
    object = constructor.newInstance(args);
  }

  protected Class[] getClasses(String[] classNames) throws Exception
  {
    Class[] classObjects = new Class[classNames.length];
    for(int i = 0; i < classNames.length; i++)
    {
      classObjects[i] = Class.forName(classNames[i]);
    }
    return classObjects;
  }

  protected Class[] getClasses(List<String> classNames) throws Exception
  {
    return Reflector.this.getClasses(classNames.toArray(new String[0]));
  }

  protected Object[] getObjects(List<Object> args) throws Exception
  {
    return args.toArray(new Object[0]);
  }

  public Object call(String methodName) throws Exception
  {
    Method method = classObject.getMethod(methodName);
    return method.invoke(object);
  }

  public <T> T call(Class<T> type, String methodName) throws Exception
  {
    return type.cast(call(methodName));
  }

  public Object call(String methodName, Class[] parameterTypes, Object... args) throws Exception
  {
    Method method = classObject.getMethod(methodName, parameterTypes);
    return method.invoke(object, args);
  }

  public <T> T call(Class<T> type, String methodName, Class[] parameterTypes, Object... args) throws Exception
  {
    return type.cast(call(methodName, parameterTypes, args));
  }

  public Object call(String methodName, String[] parameterTypes, Object... args) throws Exception
  {
    return call(methodName, getClasses(parameterTypes), args);
  }

  public <T> T call(Class<T> type, String methodName, String[] parameterTypes, Object... args) throws Exception
  {
    return type.cast(call(methodName, parameterTypes, args));
  }

  public Object call(String methodName, List<String> parameterTypes, List<Object> args) throws Exception
  {
    return call(methodName, getClasses(parameterTypes), getObjects(args));
  }

  public <T> T call(Class<T> type, String methodName, List<String> parameterTypes, List<Object> args) throws Exception
  {
    return type.cast(call(methodName, parameterTypes, args));
  }

  public Object field(String fieldName) throws Exception
  {
    Field field = classObject.getField(fieldName);
    return field.get(object);
  }

  public <T> T field(Class<T> type, String fieldName) throws Exception
  {
    return type.cast(field(fieldName));
  }

  public Object get() throws Exception
  {
    return object;
  }

  public <T> T get(Class<T> type) throws Exception
  {
    return type.cast(object);
  }
}
