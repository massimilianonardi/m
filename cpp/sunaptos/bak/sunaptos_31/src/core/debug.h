#ifdef DEBUG
#include <iostream>
#define debug(sequence) \
do\
{\
  std::cout << sequence << "\n";\
}\
while(0);
#else
#define debug(sequence)
#endif

#ifdef DEBUG
#define debug_instruction(instruction) instruction
#else
#define debug_instruction(instruction)
#endif
