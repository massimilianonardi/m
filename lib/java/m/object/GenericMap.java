package m.object;

import m.stream.*;

public interface GenericMap<T> extends GenericMapInput<T>, GenericMapOutput<T>
{
  public StreamObject<GenericMapEntry<T>> toStream() throws Exception;
}
