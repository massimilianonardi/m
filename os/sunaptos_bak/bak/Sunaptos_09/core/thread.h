#ifndef _THREAD_H
#define	_THREAD_H

class Thread
{
  public:
    Thread();
    virtual ~Thread();

    virtual void start();
//    virtual void stop() = 0;
    virtual void run() = 0;
};

#endif	// _THREAD_H
