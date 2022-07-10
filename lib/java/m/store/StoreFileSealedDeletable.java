package m.store;

public interface StoreFileSealedDeletable extends StoreFileSealed
{
  public void fileDelete(String index) throws Exception;
}
