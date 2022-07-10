#include "input_hid.h"

#include "input.h"

SERVICE_EXPORT(input_hid)

#ifdef WIN32

void register_all_devices(HWND hWnd, bool register_flag)
{
  RAWINPUTDEVICE rid;
  BOOL ret;
  
  if(register_flag)
  {
    rid.dwFlags = RIDEV_DEVNOTIFY | RIDEV_INPUTSINK | RIDEV_PAGEONLY;
  }
  else
  {
    rid.dwFlags = RIDEV_REMOVE;
  }
  rid.hwndTarget = hWnd;
  rid.usUsage = 0;
  for(int i = 1; i < 0x92; ++i)
  {
    rid.usUsagePage = i;
    ret = RegisterRawInputDevices(&rid, 1, sizeof(RAWINPUTDEVICE));
    if(!ret)
    {
      exception_throw_type(exception_type::undefined)
    }
  }
}

LRESULT CALLBACK window_callback(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
  switch(message)
  {
    case WM_INPUT:
    {
      service* ihid = (service*) GetWindowLongPtr(hWnd, GWLP_USERDATA);
      sequence packet;
      UINT nbuf = 0;
      LPVOID pData;
      LPVOID pDataName;
      RAWINPUT ri;
      
      // efficiently preallocate top level packet structure
      packet.links_resize(4);
      
      // get raw input data structure
      GetRawInputData((HRAWINPUT) lParam, RID_INPUT, NULL, &nbuf, sizeof(RAWINPUTHEADER));
      pData = malloc(nbuf);
      GetRawInputData((HRAWINPUT) lParam, RID_INPUT, pData, &nbuf, sizeof(RAWINPUTHEADER));
      ri = *((RAWINPUT*) pData);
      
      // get device name
      if(ri.header.hDevice == 0)
      {
        // windows bug: fires dirty events on right mouse button
        debug("RAW INPUT: hDevice = 0")
        break;
      }
      GetRawInputDeviceInfo(ri.header.hDevice, RIDI_DEVICENAME, NULL, &nbuf);
      pDataName = malloc(nbuf);
      GetRawInputDeviceInfo(ri.header.hDevice, RIDI_DEVICENAME, pDataName, &nbuf);
      // todo use an efficient handle to name mapping
      packet(0) = (char*) pDataName;
      free(pDataName);
      
      if(ri.header.dwType == RIM_TYPEMOUSE)
      {
        debug("RIM_TYPEMOUSE")
        packet(1) = (double) input_type::mouse;
        // packet value: <button, x, y, z=wheel_delta, device additional info and buttons raw state>
        packet(3).links_resize(5);
        packet(3)(1) = (double) ri.data.mouse.lLastX;
        packet(3)(2) = (double) ri.data.mouse.lLastY;
        packet(3)(4).links_resize(8);
        packet(3)(4)(0) = (double) ri.data.mouse.usFlags;
        packet(3)(4)(1) = (double) ri.data.mouse.ulButtons;
        packet(3)(4)(2) = (double) ri.data.mouse.usButtonFlags;
        packet(3)(4)(3) = (double) ri.data.mouse.usButtonData;
        packet(3)(4)(4) = (double) ri.data.mouse.ulRawButtons;
        packet(3)(4)(5) = (double) ri.data.mouse.lLastX;
        packet(3)(4)(6) = (double) ri.data.mouse.lLastY;
        packet(3)(4)(7) = (double) ri.data.mouse.ulExtraInformation;
        
        // the following is never used by windows even if documentation claim so
        // mouse movement
//        if(ri.data.mouse.usFlags & MOUSE_MOVE_ABSOLUTE)
//        {
//          packet(2) = (double) input_value_type::absolute;
//        }
//        else if(ri.data.mouse.usFlags & MOUSE_MOVE_RELATIVE)
//        {
//          packet(2) = (double) input_value_type::relative;
//        }
//        else
//        {
//          packet(2) = (double) input_value_type::undefined;
//          packet(3)(0) = (double) ri.data.mouse.usFlags;
//          ihid->write(packet);
//        }
        
        // fixes windows bug and wrong documentation (usFlags is never valorized on mouse movement against documentation claim)
        // usButtonFlags = 0 on mouse movement and always relative coordinates
        if(!(ri.data.mouse.usButtonFlags))
        {
          packet(2) = (double) input_value_type::relative;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_1_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 1;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_1_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 1;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_2_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 2;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_2_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 2;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_3_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 3;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_3_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 3;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_4_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 4;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_4_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 4;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_5_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 5;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_5_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 5;
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_WHEEL)
        {
          packet(2) = (double) input_value_type::relative;
          packet(3)(3) = (double)(signed SHORT) ri.data.mouse.usButtonData;
        }
      }
      else if(ri.header.dwType == RIM_TYPEKEYBOARD)
      {
        debug("RIM_TYPEKEYBOARD")
        packet(1) = (double) input_type::keyboard;
        
        // NB the following test is correct! it fixes the wrong flag definition of windows (RI_KEY_MAKE=0 => cannot test!)
        if((ri.data.keyboard.Flags & RI_KEY_BREAK) == RI_KEY_MAKE)
        {
          packet(2) = (double) input_value_type::down;
        }
        else if((ri.data.keyboard.Flags & RI_KEY_BREAK) == RI_KEY_BREAK)
        {
          packet(2) = (double) input_value_type::up;
        }
        else
        {
          packet(2) = (double) input_value_type::undefined;
        }
        
        packet(3).links_resize(3);
        // fixes windows bug not setting RI_KEY_E1, but only RI_KEY_E0 and in only in some cases
        double scancode = 0;
        if((ri.data.keyboard.Flags & RI_KEY_E0) == RI_KEY_E0)
        {
          scancode = 0x00010000;
        }
        
        // unifies left/right versions of some keys into one unique scancode
        packet(3)(0) = scancode + (double) ri.data.keyboard.MakeCode;
        
        packet(3)(1) = (double) ri.data.keyboard.VKey;
        
        packet(3)(2).links_resize(6);
        packet(3)(2)(0) = (double) ri.data.keyboard.MakeCode;
        packet(3)(2)(1) = (double) ri.data.keyboard.Flags;
        packet(3)(2)(2) = (double) ri.data.keyboard.Reserved;
        packet(3)(2)(3) = (double) ri.data.keyboard.VKey;
        packet(3)(2)(4) = (double) ri.data.keyboard.Message;
        packet(3)(2)(5) = (double) ri.data.keyboard.ExtraInformation;
      }
      else if(ri.header.dwType == RIM_TYPEHID)
      {
        debug("RIM_TYPEHID")
        packet(1) = (double) input_type::hid;
        packet(2) = (double) input_value_type::custom;
        packet(3).links_resize(3);
        packet(3)(0) = ri.data.hid.dwSizeHid;
        packet(3)(1) = ri.data.hid.dwCount;
        
        int size = ri.data.hid.dwSizeHid * ri.data.hid.dwCount;
        unsigned char* source = ri.data.hid.bRawData;
        packet(3)(2).resize(size + 1);
        packet(3)(2).type_set(sequence_type::undefined);
        for(int i = 0; i < size; ++i)
        {
          packet(3)(2)[i + 1] = source[i];
        }
      }
      
      free(pData);
      ihid->write(packet);
    }
    break;
    case WM_INPUT_DEVICE_CHANGE:
      switch(wParam)
      {
        debug("WM_INPUT_DEVICE_CHANGE")
        case GIDC_ARRIVAL:
//          debug("GIDC_ARRIVAL")
        break;
        case GIDC_REMOVAL:
//          debug("GIDC_REMOVAL")
        break;
        default:
        break;
      }
    break;
    default:
//      debug("UNPROCESSED_MESSAGE")
    break;
  }
  
  return DefWindowProc(hWnd, message, wParam, lParam);
}

input_hid::input_hid(SERVICE_METHOD_PARAMETERS)
{
  hInstance = GetModuleHandle(NULL);
  
  wc.style = 0;
  wc.lpfnWndProc = window_callback;
  wc.cbClsExtra = 0;
  wc.cbWndExtra = 0;
  wc.hInstance = hInstance;
  wc.hIcon = NULL;
  wc.hCursor = NULL;
  wc.hbrBackground = NULL;
  wc.lpszMenuName = NULL;
  wc.lpszClassName = "input_window_class";
  
  wndClass = RegisterClass(&wc);
  if(!wndClass)
  {
    exception_throw_type(exception_type::creation_failed)
  }
  
  thread::start();
}

input_hid::~input_hid()
{
  thread::stop();
  if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
  {
    exception_throw_type(exception_type::undefined)
  }
}

void input_hid::runloop()
{
  hWnd = CreateWindow(wc.lpszClassName, NULL, 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, hInstance, NULL);
  if(hWnd == NULL)
  {
    if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
    {
      exception_throw_type(exception_type::undefined)
    }
    exception_throw_type(exception_type::creation_failed)
  }
  
  SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG_PTR) this);
  
  register_all_devices(hWnd, true);
  
  MSG msg;
  BOOL gmret;
  while(thread::active)
  {
    gmret = GetMessage(&msg, hWnd, 0, 0);
    if((gmret == -1) || (gmret == 0))
    {
      thread::active = false;
      break;
    }
    // todo verify that translate message can be removed
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
  
  register_all_devices(hWnd, false);
  if(0 == DestroyWindow(hWnd))
  {
    exception_throw_type(exception_type::undefined)
  }
}

#elif defined LINUX

input_hid::input_hid(SERVICE_METHOD_PARAMETERS)
{
}

input_hid::~input_hid()
{
}

#endif
