#include "storageosfs.h"
#include "filestream.h"
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <stdio.h>

StorageOSFS::StorageOSFS(Loader* loader)
{
  std::cout << "\n[StorageOSFS::StorageOSFS] ";
  
  rootdir = "./storageosfs";
//  idrules << 1000001;
//  iddstructs << 2000001;
//  iddstructsrules << 1000001;
//  std::cout << "\n[StorageOSFS::StorageOSFS] 01";
//
//  idrules.write(&FileStream("100"));
//  iddstructs.write(&FileStream("200"));
//  iddstructsrules.write(&FileStream("300"));
//  std::cout << "\n[StorageOSFS::StorageOSFS] 02";

  idrules.read(&FileStream("100"));
  iddstructs.read(&FileStream("200"));
  iddstructsrules.read(&FileStream("300"));
  std::cout << "\n[StorageOSFS::StorageOSFS] 03";

  std::cout << "\n[StorageOSFS::StorageOSFS] idrules " << idrules.size();
  std::cout << "\n[StorageOSFS::StorageOSFS] idrules " << idrules.width();
  std::cout << "\n[StorageOSFS::StorageOSFS] idrules " << (long) idrules[0];
  std::cout << "\n[StorageOSFS::StorageOSFS] idrules " << (long) idrules[idrules.size() - 1];
  std::cout << "\n[StorageOSFS::StorageOSFS] idrules " << (char*) idrules;
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructs " << iddstructs.size();
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructs " << iddstructs.width();
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructs " << (long) iddstructs[0];
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructs " << (long) iddstructs[iddstructs.size() - 1];
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructs " << (char*) iddstructs;
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructsrules " << iddstructsrules.size();
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructsrules " << iddstructsrules.width();
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructsrules " << (long) iddstructsrules[0];
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructsrules " << (long) iddstructsrules[iddstructsrules.size() - 1];
  std::cout << "\n[StorageOSFS::StorageOSFS] iddstructsrules " << (char*) iddstructsrules;
}

StorageOSFS::~StorageOSFS()
{
  std::cout << "\n[StorageOSFS::~StorageOSFS] ";

  flush();
}

Sequence& StorageOSFS::storagesequencespace(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::storagesequencespace] ";
  return res;
}

Sequence& StorageOSFS::storagesequence(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::storagesequence] ";
  return res;
}

Sequence& StorageOSFS::create(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::create] START";
  long idds;
  idds = iddstructs[iddstructs.size() - 1] + 1;
  std::stringstream fname;
  fname << idds;
  FileStream::create(fname.str().c_str());
  std::cout << "\n[StorageOSFS::create] 00 " << idds;
  std::cout << "\n[StorageOSFS::create] 01 " << params.size();
  std::cout << "\n[StorageOSFS::create] 02 " << params(0).size();
  params(0).write(&FileStream(fname.str().c_str()));
//  params(0).write(&FileStream("2000003"));
  iddstructs << idds;
  iddstructsrules << 1000001;
  flush();
  res << idds;
  std::cout << "\n[StorageOSFS::create] END";

  return res;
}

Sequence& StorageOSFS::modify(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::modify] START";
  std::cout << "\n[StorageOSFS::modify] END";
  return res;
}

Sequence& StorageOSFS::get(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::get] START";
  Sequence& name = params(0);
//  Sequence& sind = params(1); // ignored at this time
  std::cout << "\n[StorageOSFS::get] 01 " << name.size();
  std::cout << "\n[StorageOSFS::get] 01 " << (char*) name;

  Sequence seq;
  seq.read(&FileStream((char*) name));
  res = seq;
  // todo: filter rule implementation
  std::cout << "\n[StorageOSFS::get] END";
  return res;
}

Sequence& StorageOSFS::set(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::set] START";
  Sequence& name = params(0);
  Sequence& sind = params(1);
  Sequence& sval = params(2);

  // todo: obtain seq from get method passing res
  res.read(&FileStream((char*) name));
//  std::cout << "\n[StorageOSFS::set] 02"; getchar();

  for(number i = 0; i < sind.size(); i++)
  {
    Sequence& tmp = res(sind(i)[0]);
//    std::cout << "\n[StorageOSFS::set] 03"; getchar();
    for(number j = 1; j < sind(i).size() - 1; j++)
    {
      tmp = tmp(sind(i)[j]);
    }
//    std::cout << "\n[StorageOSFS::set] 04"; getchar();
    for(number j = 0; j < sval(i).size(); j++)
    {
//      std::cout << "\n[StorageOSFS::set] 04 " << sval(i)[j];
      tmp.set<number>(sval(i)[j], sind(i).size() - 1);
    }
  }
//  std::cout << "\n[StorageOSFS::set] 05"; getchar();

  // todo: think if write is duty of this method as res was obtained by get...
  res.write(&FileStream((char*) name));
  std::cout << "\n[StorageOSFS::set] END";
  return res;
}

Sequence& StorageOSFS::ins(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::ins] START";
  Sequence& name = params(0);
  Sequence& sind = params(1);
  Sequence& sval = params(2);

  // todo: obtain seq from get method passing res
  res.read(&FileStream((char*) name));

  for(number i = 0; i < sind.size(); i++)
  {
    Sequence& tmp = res(sind(i)[0]);
    for(number j = 1; j < sind(i).size() - 1; j++)
    {
      tmp = tmp(sind(i)[j]);
    }
    for(number j = 0; j < sval(i).size(); j++)
    {
      tmp.ins<number>(sval(i)[j], sind(i)[sind(i).size() - 1]);
    }
  }

  // todo: think if write is duty of this method as res was obtained by get...
  res.write(&FileStream((char*) name));
  std::cout << "\n[StorageOSFS::ins] END";
  return res;
}

Sequence& StorageOSFS::del(Sequence& params, Sequence& res)
{
  std::cout << "\n[StorageOSFS::del] START";
  Sequence& name = params(0);
  Sequence& sind = params(1);
  Sequence& srng = params(2);
  std::cout << "\n[StorageOSFS::del] END";
  return res;
}

void StorageOSFS::flush()
{
  idrules.write(&FileStream("100"));
  iddstructs.write(&FileStream("200"));
  iddstructsrules.write(&FileStream("300"));
}
