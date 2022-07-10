package m.object;

public interface ConstructDestruct
{
  default public void construct(Obj args) throws Exception
  {
  }
  
  default public void destruct() throws Exception
  {
  }
}
