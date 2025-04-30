#include <cstdlib>
#include <iostream>

#include "sequence.h"
#include "kernel.h"

int main(int argc, char** argv)
{
  try
  {
    std::cout << "\n[Process 00] " << argv[0] << " " << argv[1] << " " << argv[2] << " " << argv[3] << " " << argv[4] << " " << argv[5];
    Sequence params;
    params << argv[1];
    params << new Sequence();
    params(1) << atoi(argv[2]) << argv[3];
    params << new Sequence();
    params(2) << atoi(argv[4]) << argv[5];

    Kernel* k = new Kernel(params);

    // wait until exit request
    std::cout << "\n[PRESS ANY KEY TO TERMINATE]\n";
    getchar();

    // cleanup sequence
    delete k;
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
