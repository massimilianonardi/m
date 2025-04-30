package m.store;

public interface StoreSealedDeletable extends StoreSealed
{
  public void delete(String id) throws Exception;
}
