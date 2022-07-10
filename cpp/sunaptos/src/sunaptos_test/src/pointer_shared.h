#ifndef POINTER_SHARED_H
#define POINTER_SHARED_H

#include <memory>

template<typename T> using pointer_shared = std::shared_ptr<T>;

#endif
