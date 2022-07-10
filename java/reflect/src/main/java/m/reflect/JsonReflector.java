package m.reflect;

import java.util.*;

import m.log.*;
import m.json.*;

/**

JSON REFLECTION
[
  get object by creation
  {
    "json-reflected-object": true,
    "class": "java.lang.String",
    "constructor.types": ["java.lang.String"],
    "constructor.args": ["-test-string-"]
  },
  
  get only class for access only to static methods and fields
  {
    "json-reflected-object": true,
    "class": "java.lang.String",
    "construct": false
  },
  
  get object by name
  {
    "json-reflected-object": true,
    "name": "testStringObject"
  },
  
  get first object of an interface
  {
    "json-reflected-object": true,
    "interface": "String"
  },
  
  create an object and assign a name and interfaces to it
  {
    "json-reflected-object": true,
    "class": "java.lang.String",
    "constructor.types": ["java.lang.String"],
    "constructor.args": ["-test-string-"],
    "assign.name": "testStringObject",
    "assign.interface": "String",
    "assign.interfaces": ["String", "MyInterface"]
  },
  
  pass argument to constructor (or method) recursively by json reflection
  {
    "json-reflected-object": true,
    "class": "java.lang.String",
    "constructor.types": ["java.lang.String"],
    "constructor.args":
    [
      {
        "json-reflected-object": true,
        "name": "testStringObject2"
      }
    ],
    "assign.name": "testStringObject",
    "assign.interface": "String",
    "assign.interfaces": ["String", "MyInterface"]
  },
  
  create an object and recursively get objects from it by accessing its fields or call its methods
  {
    "json-reflected-object": true,
    "class": "java.lang.String",
    "constructor.types": ["java.lang.String"],
    "constructor.args": ["-test-string-"],
    "assign.name": "testStringObject",
    "invoke":
    [
      {
        "method": "concat",
        "method.types": ["java.lang.String"],
        "method.args": ["-concatenate-test-"],
        "assign.name": "testStringConcatenated",
        "assign.interface": "String",
        "assign.interfaces": ["String", "MyInterface"],
        "invoke": [...]
      },
      {
        "field": "internalBuffer",
        "assign.name": "testStringInternalBuffer", // eventual assignement to a global object provider
        "assign.interface": "String",
        "assign.interfaces": ["String", "MyInterface"],
        "invoke": [...]
      }
    ]
  }
]

*/

public class JsonReflector
{
  static final public String SIGNATURE = "json-reflected-object";
  static final public String NAME = "name";
  static final public String CLASS = "class";
  static final public String CONSTRUCT = "construct";
  static final public String CONSTRUCTOR_TYPES = "constructor.types";
  static final public String CONSTRUCTOR_ARGS = "constructor.args";
  static final public String INVOKE = "invoke";
  static final public String METHOD = "method";
  static final public String METHOD_TYPES = "method.types";
  static final public String METHOD_ARGS = "method.args";
  static final public String FIELD = "field";
  static final public String ASSIGN_NAME = "assign.name";
  static final public String ASSIGN_INTERFACE = "assign.interface";
  static final public String ASSIGN_INTERFACES = "assign.interfaces";
  
  public Map<String, Object> objects = new HashMap<String, Object>();
  
  public JsonReflectorWatch watch(String directoryPath) throws Exception
  {
    return new JsonReflectorWatch(this, directoryPath);
  }
  
  public Object process(Json json) throws Exception
  {
    Log.debug(json);
    
    if(json.type(List.class))
    {
      int size = json.list().size();
      for(int i = 0; i < size; i++)
      {
        Log.debug("process list element: " + i);
        processElement(json.get(i));
      }
      return null;
    }
    else if(json.type(Map.class))
    {
      Log.debug("process single element: ");
      return processElement(json);
    }
    else
    {
      throw new Exception();
    }
  }
  
  public <T> T process(Class<T> type, Json json) throws Exception
  {
    return type.cast(process(json));
  }
  
  protected Object ___processElement(Json json) throws Exception
  {
    Log.debug(json);
    
    if(!json.type(Map.class) || !json.map().containsKey(SIGNATURE))
    {
      throw new Exception();
    }
    
    Reflector objReflect = null;
    
    String name = json.string(NAME);
    if(name != null)
    {
      Object obj = objects.get(name);
      
//      if(obj == null)
//      {
//        throw new Exception();
//      }
      
      objReflect = new Reflector(obj);
    }
    else
    {
      String className = json.string(CLASS);
      if(className != null)
      {
        Boolean construct = json.bool(CONSTRUCT);
        List constructorTypes = json.list(CONSTRUCTOR_TYPES);
        List constructorArgs = json.list(CONSTRUCTOR_ARGS);
        if(construct != null && construct == false)
        {
          objReflect = new Reflector(className, false);
        }
        else
        {
          if(constructorTypes == null && constructorArgs == null)
          {
            objReflect = new Reflector(className);
          }
          else if(constructorTypes != null && constructorArgs != null)
          {
            objReflect = new Reflector(className, constructorTypes, processArgs(constructorArgs));
          }
          else
          {
            throw new Exception();
          }

          processAssignement(objReflect, json);
        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    processInvokeList(objReflect, json.get(INVOKE));
    
    return objReflect.get();
  }
  
  protected Object processElement(Json json) throws Exception
  {
    Log.debug(json);
    
    if(!json.type(Map.class) || !json.map().containsKey(SIGNATURE))
    {
      throw new Exception();
    }
    
    Reflector objReflect = null;
    
    String name = json.string(NAME);
    if(name != null)
    {
      Object obj = objects.get(name);
      
      if(obj != null)
      {
        objReflect = new Reflector(obj);
      }
    }
    else
    {
      String className = json.string(CLASS);
      if(className != null)
      {
        Boolean construct = json.bool(CONSTRUCT);
        List constructorTypes = json.list(CONSTRUCTOR_TYPES);
        List constructorArgs = json.list(CONSTRUCTOR_ARGS);
        if(construct != null && construct == false)
        {
          objReflect = new Reflector(className, false);
        }
        else
        {
          if(constructorTypes == null && constructorArgs == null)
          {
            objReflect = new Reflector(className);
          }
          else if(constructorTypes != null && constructorArgs != null)
          {
            objReflect = new Reflector(className, constructorTypes, processArgs(constructorArgs));
          }
          else
          {
            throw new Exception();
          }

          processAssignement(objReflect, json);
        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    processInvokeList(objReflect, json.get(INVOKE));
    
    return objReflect.get();
  }
  
  protected void processInvokeList(Reflector objReflect, Json json) throws Exception
  {
    Log.debug(json);
    
    if(json == null)
    {
      return;
    }
    
    if(!json.type(List.class))
    {
      throw new Exception();
    }
    
    int size = json.list().size();
    for(int i = 0; i < size; i++)
    {
      processInvoke(objReflect, json.get(i));
    }
  }
  
  protected void ___processInvoke(Reflector objReflect, Json json) throws Exception
  {
    Log.debug(json);
    
    Reflector objReflectInvoked = null;
    
    String field = json.string(FIELD);
    if(field != null)
    {
      Object obj = objReflect.field(field);
      
//      if(obj == null)
//      {
//        throw new Exception();
//      }
      
      objReflectInvoked = new Reflector(obj);
    }
    else
    {
      String method = json.string(METHOD);
      if(method != null)
      {
        List methodTypes = json.list(METHOD_TYPES);
        List methodArgs = json.list(METHOD_ARGS);
        if(methodTypes == null && methodArgs == null)
        {
          objReflectInvoked = new Reflector(objReflect.call(method));
        }
        else if(methodTypes != null && methodArgs != null)
        {
          objReflectInvoked = new Reflector(objReflect.call(method, methodTypes, processArgs(methodArgs)));
        }
        else
        {
          throw new Exception();
        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    processAssignement(objReflectInvoked, json);
    processInvokeList(objReflectInvoked, json.get(INVOKE));
  }
    
  protected void processInvoke(Reflector objReflect, Json json) throws Exception
  {
    Log.debug(json);
    
    if(objReflect == null)
    {
      throw new Exception();
    }
    
    Reflector objReflectInvoked = null;
    Object obj = null;
    
    String field = json.string(FIELD);
    if(field != null)
    {
      obj = objReflect.field(field);
    }
    else
    {
      String method = json.string(METHOD);
      if(method != null)
      {
        List methodTypes = json.list(METHOD_TYPES);
        List methodArgs = json.list(METHOD_ARGS);
        if(methodTypes == null && methodArgs == null)
        {
          obj = objReflect.call(method);
        }
        else if(methodTypes != null && methodArgs != null)
        {
          obj = objReflect.call(method, methodTypes, processArgs(methodArgs));
        }
        else
        {
          throw new Exception();
        }
      }
      else
      {
        throw new Exception();
      }
    }
    
    if(obj != null)
    {
      objReflectInvoked = new Reflector(obj);
    }
    
    processAssignement(objReflectInvoked, json);
    processInvokeList(objReflectInvoked, json.get(INVOKE));
  }

  protected List<Object> processArgs(List<Object> args) throws Exception
  {
    int size = args.size();
    for(int i = 0; i < size; i++)
    {
      Object obj = args.get(i);
      try
      {
        Map.class.cast(obj);
        if(!((Map) obj).containsKey(SIGNATURE))
        {
          throw new Exception();
        }
      }
      catch(Exception e)
      {
        continue;
      }
      
      obj = processElement(new Json(obj));
      args.set(i, obj);
    }
    
    return args;
  }
  
  protected void processAssignement(Reflector objReflect, Json json) throws Exception
  {
    Log.debug(json);
    
    String assignToName = json.string(ASSIGN_NAME);
    if(assignToName != null)
    {
      objects.put(assignToName, objReflect.get());
    }
    
    // todo check assignemento to interfaces
  }
}
