#ifndef _SINGLETON_H
#define	_SINGLETON_H

// "Meyers singleton pattern": not to be used for interdependable singletons during construction/destruction
// it is thread safe, is possible to force a construction order (invoking orderly into the init of app),
// destruction order is not possible to force.
template <typename T>
class Singleton
{
public:
  static T& i()
  {
    static T inst;
    return inst;
  }

protected:
  Singleton() = default;
  virtual ~Singleton() = default;
  Singleton(const Singleton&) = delete;
  Singleton& operator=(const Singleton&) = delete;
  // C++98
  //Singleton(){};
  //virtual ~Singleton(){};
  //Singleton(const Singleton&);
  //Singleton& operator=(const Singleton&);
};

#endif	// _SINGLETON_H
