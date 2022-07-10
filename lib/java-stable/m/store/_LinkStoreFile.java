package m.store;

// index that symlinks (relatively) to internal file store or link-file to access external files (other m-net services, web services, http/s, kad, bt, etc.)
// only refs, not files! refs can contain hashes (different algs must be supported) and check is performed on-the-fly while downloading and after last byte throw error if not valid
// useful in a multimount holder instance, or in a link-store-path
public class _LinkStoreFile
{
  
}
