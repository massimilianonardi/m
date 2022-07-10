#include "dlibcli.h"

DLibCli::DLibCli(const char* name) throw (const char*) : DynamicLibraryLoader(name)
{
}

Object* DLibCli::create(CommandListener* cl) throw (const char*)
{
  typedef Object* (*CLIConstructor)(CommandListener*);
  CLIConstructor createcli = (CLIConstructor) this->getFuncAddress("create");
  return (*createcli)(cl);
}
