#ifndef _SINGLETON_H
#define	_SINGLETON_H

// "Meyers singleton pattern": not to be used for interdependable singletons during construction/destruction
// it is thread safe, is possible to force a construction order (invoking orderly into the init of app),
// destruction order is not possible to force.
template <typename T>
class Singleton
{
  protected:
    Singleton();
    virtual ~Singleton();

  public:
    static T& i()
    {
      static T inst;

      return inst;
    }
};

#endif	// _SINGLETON_H
