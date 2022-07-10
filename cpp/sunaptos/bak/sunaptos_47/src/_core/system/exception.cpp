#include "exception.h"

#include <iostream>

Exception::Exception()
{
//  ss << "Exception::Exception\n";
}

Exception::Exception(const char* file, unsigned long line, const char* function)
{
  ss << "Exception thrown: " << file << " --- " << line << " --- " << function << "\n";
}

Exception::Exception(const char* file, unsigned long line, const char* function, Exception::type type)
{
  ss << "Exception thrown: " << file << " --- " << line << " --- " << function << " --- " << type << "\n";
}

Exception::Exception(const char* file, unsigned long line, const char* function, Exception::type type, const char* info): t(type)
{
  ss << "Exception thrown: " << file << " --- " << line << " --- " << function << " --- " << type << " --- " << info << "\n";
}

Exception::~Exception()
{
}

Exception::Exception(const Exception& e)
{
  *this = e;
}

Exception& Exception::operator=(const Exception& e)
{
  ss.str("");
  ss << e.ss.str().c_str();
  return *this;
}

void Exception::add(const Exception& e)
{
  ss << e.ss.str().c_str();
}

void Exception::add(const char* file, unsigned long line, const char* function)
{
  ss << "Exception caught: " << file << " --- " << line << " --- " << function << "\n";
}

void Exception::add(const char* file, unsigned long line, const char* function, Exception::type type)
{
  ss << "Exception caught: " << file << " --- " << line << " --- " << function << " --- " << type << "\n";
}

void Exception::add(const char* file, unsigned long line, const char* function, Exception::type type, const char* info)
{
  ss << "Exception caught: " << file << " --- " << line << " --- " << function << " --- " << type << " --- " << info << "\n";
}

void Exception::rethrow(const char* file, unsigned long line, const char* function)
{
  ss << "Exception rethrown: " << file << " --- " << line << " --- " << function << "\n";
}

void Exception::checkpoint(const char* file, unsigned long line, const char* function)
{
  ss << "Exception checkpoint reached: " << file << " --- " << line << " --- " << function << "\n";
}

const char* Exception::text()
{
  return ss.str().c_str();
}

void Exception::printstacktrace()
{
  std::cerr << text();
}
