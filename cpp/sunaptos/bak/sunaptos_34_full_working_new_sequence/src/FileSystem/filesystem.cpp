#include "filesystem.h"

FileSystem::FileSystem(Service* k)
{
}

FileSystem::~FileSystem()
{
}

Sequence FileSystem::f(number i, Sequence& params)
{
  debug("[FileSystem::f]")
  debug("[FileSystem::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;

  switch((long) i)
  {
    case FileSystem::dir_read:
      res = dirRead(params);
      break;

    case FileSystem::dir_new:
      res = dirNew(params);
      break;

    case FileSystem::dir_del:
      res = dirDel(params);
      break;

    case FileSystem::dir_ren:
      res = dirRen(params);
      break;

    case FileSystem::file_new:
      res = fileNew(params);
      break;

    case FileSystem::file_del:
      res = fileDel(params);
      break;

    case FileSystem::file_ren:
      res = fileRen(params);
      break;

    case FileSystem::file_move:
      res = fileMove(params);
      break;

    case FileSystem::file_copy:
      res = fileCopy(params);
      break;

    case FileSystem::file_open:
      res = fileOpen(params);
      break;

    case FileSystem::file_position_get:
      res = filePositionGet(params);
      break;

    case FileSystem::file_position_set:
      res = filePositionSet(params);
      break;

    case FileSystem::file_read:
      res = fileRead(params);
      break;

    case FileSystem::file_write:
      res = fileWrite(params);
      break;

    case FileSystem::file_close:
      res = fileClose(params);
      break;

    case FileSystem::attributes_get:
      res = attributesGet(params);
      break;

    case FileSystem::attributes_set:
      res = attributesSet(params);
      break;

    default:
      // error! function not supported!!!
      break;
  }
  return res;
}

Sequence FileSystem::dirRead(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::dirNew(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::dirDel(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::dirRen(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileNew(Sequence& params)
{
  Sequence res;
  FILE* f = fopen(params, "wb");
  fclose(f);
  return res;
}

Sequence FileSystem::fileDel(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileRen(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileMove(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileCopy(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileOpen(Sequence& params)
{
  Sequence res;
  FILE* file = fopen(params, "rb+");
  if(file == 0)
  {
    throw;
  }
  res << (long) file;
  return res;
}

Sequence FileSystem::filePositionGet(Sequence& params)
{
  Sequence res;
//  res << ftell(params);
  res << ftell((FILE*)(char*) params);
  return res;
}

Sequence FileSystem::filePositionSet(Sequence& params)
{
  Sequence res;
//  fseek(params(0), 0, params[1]);
  fseek((FILE*)(char*) params(0), 0, params(1));
  return res;
}

Sequence FileSystem::fileRead(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileWrite(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::fileClose(Sequence& params)
{
  Sequence res;
  fclose((FILE*) params[0]);
  return res;
}

Sequence FileSystem::attributesGet(Sequence& params)
{
  Sequence res;
  return res;
}

Sequence FileSystem::attributesSet(Sequence& params)
{
  Sequence res;
  return res;
}
