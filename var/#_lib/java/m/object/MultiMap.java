package m.object;

import m.stream.*;

public interface MultiMap<T> extends MultiMapInput<T>, MultiMapOutput<T>
{
  public StreamObject<GenericMapEntry<GenericMap<T>>> toStream() throws Exception;
}
