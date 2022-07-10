#ifdef DEBUG
#include <iostream>
#define debug(message) \
do\
{\
  std::cout << __FILE__ << " --- " << __LINE__ << " --- " << __func__ << " --- " << message << "\n";\
}\
while(0);
#else
#define debug(message)
#endif

#ifdef DEBUG
#include <string>
#include <sstream>
#define debug_line \
do\
{\
  std::string file = __FILE__;\
  int ind = file.find_last_of("/\\");\
  std::string path = file.substr(0, ind);\
  std::string filename = file.substr(1 + ind);\
  \
  std::stringstream ss;\
  ss << __LINE__;\
  std::string line = ss.str();\
  \
  std::string function = __func__;\
  \
  path.resize(100, ' ');\
  filename.resize(30, ' ');\
  line.resize(3, ' ');\
  function.resize(30, ' ');\
  \
  std::string message = "";\
  message += filename;\
  message += line;\
  message += function;\
  \
  std::cout << message << "\n";\
}\
while(0);
#else
#define debug_line
#endif

#ifdef DEBUG
#define debug_instruction(instruction) instruction
#else
#define debug_instruction(instruction)
#endif
