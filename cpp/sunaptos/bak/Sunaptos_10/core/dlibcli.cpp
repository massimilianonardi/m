#include "dlibcli.h"

DLibCli::DLibCli(const char* name): DynamicLibraryLoader(name)
{
}

DLibCli::~DLibCli()
{
}

Object* DLibCli::create(CommandListener* cl)
{
  typedef Object* (*CLIConstructor)(CommandListener*);
  CLIConstructor createcli = (CLIConstructor) this->getFuncAddress("create");
  return (*createcli)(cl);
}
