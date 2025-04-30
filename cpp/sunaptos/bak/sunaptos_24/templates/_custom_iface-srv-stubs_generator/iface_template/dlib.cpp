#include "dlib.h"

#include "template_file_name.h"

extern "C"
{

DLIB_FUNCTION_EXPORT const char* name()
{
  return "template_class";
}

DLIB_FUNCTION_EXPORT bool check(Object* obj)
{
  template_class* iface = dynamic_cast<template_class*>(obj);
  if(iface)
  {
    return true;
  }
  else
  {
    return false;
  }
}

} // extern "C"
