#ifndef GUI_H
#define	GUI_H

#include "sunaptos.h"

class gui: virtual public service, virtual public stream
//class gui: virtual public stream
{
protected:
  sequence input;
  sequence output;
  
public:
  gui(SERVICE_METHOD_PARAMETERS);
  virtual ~gui();
  
//  SERVICE_DECLARATIONS
//  virtual sequence subscribe(const sequence& params){return stream::subscribe(params);}
//  virtual sequence unsubscribe(const sequence& params){return stream::unsubscribe(params);}
//  virtual sequence write(const sequence& params){debug_line; return stream::write(params);}
//  virtual sequence subscribe(const sequence& params) = delete;
//  virtual sequence unsubscribe(const sequence& params) = delete;
//  virtual sequence write(const sequence& params) = delete;
  SERVICE_DISPATCHER_DECLARATION
  using stream::subscribe;
  using stream::unsubscribe;
  using stream::write;
};

#endif	/* GUI_H */
