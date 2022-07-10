#include "interprocesscommunication.h"
#include <windows.h>
#include <iostream>

InterProcessCommunication::InterProcessCommunication()
{
}

InterProcessCommunication::~InterProcessCommunication()
{
}

void InterProcessCommunication::init()
{
//  cmdposted = pdata;
//  ansposted = cmdposted + sizeof(bool);
//  cmd = ansposted + sizeof(bool);
//  params = cmd + sizeof(int);
//  res = params;
  if(!pb)
  {
    return;
  }
  
  nlocked = 0;
  ncmdposted = nlocked + sizeof(bool);
  nansposted = ncmdposted + sizeof(bool);
  ncmd = nansposted + sizeof(bool);
  nparams = ncmd + sizeof(int);
  nres = nparams;

  bool locked = false;
  bool cmdposted = false;
  bool ansposted = false;
  Buffer b;
  b.set(&locked, sizeof(bool));
  setWritePos(nlocked);
  write(&b);
  b.set(&cmdposted, sizeof(bool));
  setWritePos(ncmdposted);
  write(&b);
  b.set(&ansposted, sizeof(bool));
  setWritePos(nansposted);
  write(&b);
}

void InterProcessCommunication::lock()
{
  waitunlock();

  Buffer b;
  bool locked = true;
  b.set(&locked, sizeof(bool));
  setWritePos(nlocked);
  write(&b);
//  std::cout << "\n[InterProcessCommunication::lock]";
}

void InterProcessCommunication::unlock()
{
  Buffer b;
  bool locked = false;
  b.set(&locked, sizeof(bool));
  setWritePos(nlocked);
  write(&b);

  init();
  
//  std::cout << "\n[InterProcessCommunication::unlock]";
}

int InterProcessCommunication::readcmd()
{
  Buffer b;
  b.resize(sizeof(int));
  setReadPos(ncmd);
  read(&b);
  int cmd = *((int*) b.get());
//  std::cout << "\n[InterProcessCommunication::readcmd] cmd = " << cmd;

  return cmd;
}

Sequence& InterProcessCommunication::readparams(Sequence& params)
{
//  Sequence p;
  setReadPos(nparams);
  params.read(this);
  std::cout << "\n[InterProcessCommunication::readparams] size = " << params.size();
//  std::cout << "\n[InterProcessCommunication::readparams] params = " << p->gets(2)->get();
//  std::cout << "\n[InterProcessCommunication::readparams] params = " << p->gets(0)->get();

  return params;
}

Sequence& InterProcessCommunication::readres(Sequence& res)
{
//  Sequence r;
  setReadPos(nres);
  res.read(this);
  std::cout << "\n[InterProcessCommunication::readres] size = " << res.size();
//  std::cout << "\n[InterProcessCommunication::readres] res = " << r->gets(2)->get();
//  std::cout << "\n[InterProcessCommunication::readres] res = " << r->gets(3)->get();

  return res;
}

void InterProcessCommunication::writecmd(int cmd, Sequence& params)
{
  std::cout << "\n[InterProcessCommunication::writecmd] cmd = " << cmd;
  // write cmd
  Buffer b;
  b.set(&cmd, sizeof(int));
  setWritePos(ncmd);
  write(&b);

  // write params
  setWritePos(nparams);
  params.write(this);

  // writeflag
  bool cmdposted = true;
  b.set(&cmdposted, sizeof(bool));
  setWritePos(ncmdposted);
  write(&b);
  std::cout << "\n[InterProcessCommunication::writecmd] params size = " << params.size();
}

void InterProcessCommunication::writeres(Sequence& res)
{
  std::cout << "\n[InterProcessCommunication::writeres] start";
  setWritePos(nres);
  res.write(this);

  // writeflag
  Buffer b;
  bool ansposted = true;
  b.set(&ansposted, sizeof(bool));
  setWritePos(nansposted);
  write(&b);
  std::cout << "\n[InterProcessCommunication::writeres] res size = " << res.size();
}

void InterProcessCommunication::waitunlock()
{
//  std::cout << "\n[InterProcessCommunication::waitunlock] start";
  Buffer b;
  b.resize(sizeof(bool));
  setReadPos(ncmdposted);
  read(&b);
  bool cmdposted = *((bool*) b.get());
  while(cmdposted)
  {
    Sleep(500); // WIN32
    setReadPos(ncmdposted);
    read(&b);
    cmdposted = *((bool*) b.get());
  }
//  std::cout << "\n[InterProcessCommunication::waitunlock] end";
}

void InterProcessCommunication::waitcmd()
{
  std::cout << "\n[InterProcessCommunication::waitcmd] start";
  Buffer b;
  b.resize(sizeof(bool));
  setReadPos(ncmdposted);
  read(&b);
  bool cmdposted = *((bool*) b.get());
  while(!cmdposted)
  {
    Sleep(500); // WIN32
    setReadPos(ncmdposted);
    read(&b);
    cmdposted = *((bool*) b.get());
  }
  std::cout << "\n[InterProcessCommunication::waitcmd] end";
}

void InterProcessCommunication::waitres()
{
  std::cout << "\n[InterProcessCommunication::waitres] start";
  Buffer b;
  b.resize(sizeof(bool));
  setReadPos(nansposted);
  read(&b);
  bool ansposted = *((bool*) b.get());
  while(!ansposted)
  {
    Sleep(500); // WIN32
    setReadPos(nansposted);
    read(&b);
    ansposted = *((bool*) b.get());
  }
  std::cout << "\n[InterProcessCommunication::waitres] end";
}
