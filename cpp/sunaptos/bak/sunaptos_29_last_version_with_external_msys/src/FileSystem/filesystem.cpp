#include "filesystem.h"

FileSystem::FileSystem(Service* k)
{
}

FileSystem::~FileSystem()
{
}

sequence FileSystem::f(sequence& i, sequence& params)
{
  debug("[FileSystem::f]")
  debug("[FileSystem::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;

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

sequence FileSystem::dirRead(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::dirNew(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::dirDel(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::dirRen(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileNew(sequence& params)
{
  sequence res;
  FILE* f = fopen(params, "wb");
  fclose(f);
  return res;
}

sequence FileSystem::fileDel(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileRen(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileMove(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileCopy(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileOpen(sequence& params)
{
  sequence res;
  FILE* file = fopen(params, "rb+");
  if(file == 0)
  {
    throw;
  }
  res << (long) file;
  return res;
}

sequence FileSystem::filePositionGet(sequence& params)
{
  sequence res;
  res << ftell((FILE*)(long) params);
  return res;
}

sequence FileSystem::filePositionSet(sequence& params)
{
  sequence res;
  fseek((FILE*)(long) params(0), 0, params(1));
  return res;
}

sequence FileSystem::fileRead(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileWrite(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::fileClose(sequence& params)
{
  sequence res;
  fclose((FILE*)(long) params);
  return res;
}

sequence FileSystem::attributesGet(sequence& params)
{
  sequence res;
  return res;
}

sequence FileSystem::attributesSet(sequence& params)
{
  sequence res;
  return res;
}
