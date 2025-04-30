#ifndef _SINGLETON_H
#define	_SINGLETON_H

// "Meyers singleton pattern": not to be used for interdependable singletons during construction/destruction
// it is thread safe, is possible to force a construction order (invoking orderly into the init of app),
// destruction order is not possible to force.
template <class T>
class Singleton
{
  protected:
    Singleton();
//    Singleton(Singleton const& orig);
    virtual ~Singleton();

//    Singleton& operator =(Singleton const& orig);

  public:
    static T& instance()
    {
      static T inst;

      return inst;
    }
};

#endif	// _SINGLETON_H
