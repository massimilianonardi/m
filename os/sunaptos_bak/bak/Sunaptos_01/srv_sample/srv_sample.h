#ifndef _SRV_SAMPLE_H
#define	_SRV_SAMPLE_H

#include "iface_template.h"
#include "loader.h"

class srv_sample: virtual public iface_template
{
  public:
    srv_sample(Loader* loader);
    virtual ~srv_sample();
    
    Data* method_1(Data* data);
    Data* method_2(Data* data);
    Data* method_3(Data* data);
};

#endif	// _SRV_SAMPLE_H
