#include "dlib.h"

#include "template_file_name_cli.h"

extern "C"
{

DLIB_FUNCTION_EXPORT Object* create(CommandListener* cl)
{
  // todo: if cl is null throw an exception
  template_class* is = new template_class_cli(cl);
  return dynamic_cast<Object*>(is);
}

} // extern "C"
