#include <cstdlib>
//#include <stdio.h>
#include <iostream>

#include "sequence.h"
#include "SunaptosProcess.h"

int main(int argc, char** argv)
{
  try
  {
    std::cout << "\n[sp 00]\n";
    std::cout << "\n[sp 00] " << argv[0];
    std::cout << "\n[sp 00] " << argv[1] << " " << argv[2] << " " << argv[3] << " " << argv[4] << " " << argv[5];
    Sequence params;
    params << new Sequence();
    params(0) << argv[1] << argv[2];
    params << argv[3];
    params << new Sequence();
    params(2) << argv[4] << argv[5];

    std::cout << "\n[sp 01]\n";
    SunaptosProcess* sp = new SunaptosProcess();
    std::cout << "\n[sp 02]\n";
    sp->init(params);
    std::cout << "\n[sp 03]\n";

    // wait until exit request
    std::cout << "\n[PRESS ANY KEY TO TERMINATE]\n";
    getchar();

    // cleanup sequence
    delete sp;
    std::cout << "\n[TERMINATION SUCCESSFUL]\n";
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    printf("\n[Undefined Exception!]");
    getchar();
  }

  return 0;
}
