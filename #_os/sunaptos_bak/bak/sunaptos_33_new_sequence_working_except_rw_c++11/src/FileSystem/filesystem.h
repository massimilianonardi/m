#ifndef FILESYSTEM_H
#define	FILESYSTEM_H

#include "sunaptos.h"

class FileSystem: virtual public Service
{
  public:
    enum {
      dir_read = 0,
      dir_new = 1,
      dir_del = 2,
      dir_ren = 3,
      file_new = 4,
      file_del = 5,
      file_ren = 6,
      file_move = 7,
      file_copy = 8,
      file_open = 9,
      file_position_get = 10,
      file_position_set = 11,
      file_read = 12,
      file_write = 13,
      file_close = 14,
      attributes_get = 15,
      attributes_set = 16};

    FileSystem(Service* k);
    ~FileSystem();

    Sequence f(number i, Sequence& params);

  protected:
    Sequence dirRead(Sequence& params);
    Sequence dirNew(Sequence& params);
    Sequence dirDel(Sequence& params);
    Sequence dirRen(Sequence& params);
    Sequence fileNew(Sequence& params);
    Sequence fileDel(Sequence& params);
    Sequence fileRen(Sequence& params);
    Sequence fileMove(Sequence& params);
    Sequence fileCopy(Sequence& params);
    Sequence fileOpen(Sequence& params);
    Sequence filePositionGet(Sequence& params);
    Sequence filePositionSet(Sequence& params);
    Sequence fileRead(Sequence& params);
    Sequence fileWrite(Sequence& params);
    Sequence fileClose(Sequence& params);
    Sequence attributesGet(Sequence& params);
    Sequence attributesSet(Sequence& params);
};

#endif	/* FILESYSTEM_H */
