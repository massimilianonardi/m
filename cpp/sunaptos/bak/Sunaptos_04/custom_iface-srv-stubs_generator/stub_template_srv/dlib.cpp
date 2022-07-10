#include "dlib.h"

#include "template_file_name_srv.h"

extern "C"
{

DLIB_FUNCTION_EXPORT CommandListener* create(Object* obj)
{
  template_class* srv = dynamic_cast<template_class*>(obj);
  // todo: if srv is null throw an exception
  template_class* is = new template_class_srv(srv);
  return dynamic_cast<CommandListener*>(is);
}

} // extern "C"
