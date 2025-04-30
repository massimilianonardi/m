#ifdef DEBUG
#include <iostream>
#define debug(message) \
do\
{\
  std::cout << message << "\n";\
}\
while(0);
#else
#define debug(message)
#endif

#ifdef DEBUG
#define debug_instruction(instruction) instruction
#else
#define debug_instruction(instruction)
#endif
