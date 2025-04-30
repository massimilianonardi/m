#include "storage.h"

Storage::Storage(Service* k)
{
  debug("[Storage::Storage]")
}

Storage::~Storage()
{
  debug("[Storage::~Storage]")
}

Sequence Storage::f(number i, Sequence& params)
{
  debug("[Storage::f]")
  debug("[Storage::f] i = " << (long) i << " - params = " << (char*) params)
  Sequence res;

  switch((long) i)
  {
    case Storage::get:
      res = getSequence(params);
      break;

    case Storage::set:
      res = setSequence(params);
      break;

    default:
      // error! function not supported!!!
      break;
  }
  return res;
}

Sequence Storage::getSequence(Sequence& params)
{
  Sequence res;
  FileInputStream fis((char*) params);
  res.read(fis);
  return res;
}

Sequence Storage::setSequence(Sequence& params)
{
  Sequence res;
  FileOutputStream fos((char*) params(0));
  params(1).write(fos);
  return res;
}
