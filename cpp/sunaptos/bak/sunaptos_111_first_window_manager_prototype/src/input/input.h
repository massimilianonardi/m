#ifndef INPUT_H
#define	INPUT_H

#include "sunaptos.h"


enum class input_type: unsigned char
{
  undefined = 0,
  keyboard = 1,
  mouse = 2,
  hid = 3,
  keyboard_translated = 4,
  mouse_translated = 5,
  joystick = 10,
  wheel = 11,
  joypad = 20,
  trackball = 21,
  pen = 30,
  remote_control = 31,
  mouse_air = 40,
  touchpad = 41,
  custom = 0xFF,
};

enum class input_value_type: unsigned char
{
  undefined = 0,
  down = 1,
  up = 2,
  absolute = 3,
  relative = 4,
  normalized_absolute = 5,
  normalized_relative = 6,
  custom = 0xFF,
};

class input: virtual public stream
{
protected:
  sequence devices;
  bool check(const sequence& filter, const sequence& params);
  
public:
  input(SERVICE_METHOD_PARAMETERS);
  virtual ~input();
  
//  SERVICE_METHOD_DECLARATION(subscribe)
//  SERVICE_METHOD_DECLARATION(unsubscribe)
  SERVICE_METHOD_DECLARATION(write)
  
  void runloop();
};

#endif	/* INPUT_H */
