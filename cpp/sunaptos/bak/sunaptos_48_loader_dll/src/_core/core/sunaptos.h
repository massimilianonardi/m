#ifndef SUNAPTOS_H
#define	SUNAPTOS_H

// STANDARD LIBRARY INCLUDES
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <iostream>
#include <memory>

// SUNAPTOS INCLUDES
// TODO: decide what to export to the generic user. NB system services (eg Loader) should include explicitly classes needed
// globals
#include "singleton.h"
#include "globals.h"

// service
#include "dlib.h"
#include "service.h"

#include "debug.h"

// system
#include "thread.h"
#include "dynamiclibraryloader.h"

// base
#include "buffer.h"
#include "object.h"
#include "sequence.h"
#include "exception.h"
#include "serviceloader.h"

// stream
#include "streaminput.h"
#include "streamoutput.h"
#include "stream.h"
#include "streamable.h"

#endif	/* SUNAPTOS_H */
