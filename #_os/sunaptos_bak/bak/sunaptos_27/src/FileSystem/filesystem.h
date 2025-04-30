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

    sequence f(element i, sequence& params);

  protected:
    sequence dirRead(sequence& params);
    sequence dirNew(sequence& params);
    sequence dirDel(sequence& params);
    sequence dirRen(sequence& params);
    sequence fileNew(sequence& params);
    sequence fileDel(sequence& params);
    sequence fileRen(sequence& params);
    sequence fileMove(sequence& params);
    sequence fileCopy(sequence& params);
    sequence fileOpen(sequence& params);
    sequence filePositionGet(sequence& params);
    sequence filePositionSet(sequence& params);
    sequence fileRead(sequence& params);
    sequence fileWrite(sequence& params);
    sequence fileClose(sequence& params);
    sequence attributesGet(sequence& params);
    sequence attributesSet(sequence& params);
};

#endif	/* FILESYSTEM_H */
