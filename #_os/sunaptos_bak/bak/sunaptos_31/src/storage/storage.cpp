#include "storage.h"

Storage::Storage(Service* k)
{
  debug("[Storage::Storage]")
}

Storage::~Storage()
{
  debug("[Storage::~Storage]")
}

sequence Storage::f(sequence& i, sequence& params)
{
  debug("[Storage::f]")
  debug("[Storage::f] i = " << (long) i << " - params = " << (char*) params)
  sequence res;

  switch((long) i)
  {
    case Storage::get:
      res = getsequence(params);
      break;

    case Storage::set:
      res = setsequence(params);
      break;

    default:
      // error! function not supported!!!
      break;
  }
  return res;
}

sequence Storage::getsequence(sequence& params)
{
  sequence res;
  FileInputStream fis(params);
  res.read(fis);
  return res;
}

sequence Storage::setsequence(sequence& params)
{
  sequence res;
  FileOutputStream fos(params(0));
  params(1).write(fos);
  return res;
}
