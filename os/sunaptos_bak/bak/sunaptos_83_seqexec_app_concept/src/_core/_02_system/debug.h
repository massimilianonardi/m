#ifdef DEBUG
#include <iostream>
#include <string>
#include <sstream>
#endif

#ifdef DEBUG
#define debug_instruction(instruction) instruction
#else
#define debug_instruction(instruction)
#endif

#ifdef DEBUG

#define debug(message) \
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
  file.resize(60, ' ');\
  path.resize(50, ' ');\
  filename.resize(30, ' ');\
  line.resize(6, ' ');\
  function.resize(30, ' ');\
  \
  std::string msg = "";\
  msg += path;\
  msg += filename;\
  msg = "";\
  msg += file;\
  msg += line;\
  msg += function;\
  \
  std::cout << msg << " - " << message << "\n";\
}\
while(0);

#define debug_line debug("")

#else
#define debug(message)
#define debug_line
#endif
