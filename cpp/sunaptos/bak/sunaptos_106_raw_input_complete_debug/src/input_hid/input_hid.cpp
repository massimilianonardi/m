#include "input_hid.h"

#include "input.h"

SERVICE_EXPORT(input_hid)

#ifdef WIN32

LRESULT CALLBACK window_callback(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
  debug_line
  switch(message)
  {
    case WM_INPUT:
    {
      // todo
      debug("WM_INPUT")
      
      service* ihid = (service*) GetWindowLongPtr(hWnd, GWLP_USERDATA);
      sequence packet;
      UINT nbuf = 0;
      LPVOID pData;
      LPVOID pDataName;
      RAWINPUT ri;
      
      GetRawInputData((HRAWINPUT) lParam, RID_INPUT, NULL, &nbuf, sizeof(RAWINPUTHEADER));
      pData = malloc(nbuf);
      GetRawInputData((HRAWINPUT) lParam, RID_INPUT, pData, &nbuf, sizeof(RAWINPUTHEADER));
      ri = *((RAWINPUT*) pData);
      
      GetRawInputDeviceInfo(ri.header.hDevice, RIDI_DEVICENAME, NULL, &nbuf);
      pDataName = malloc(nbuf);
      GetRawInputDeviceInfo(ri.header.hDevice, RIDI_DEVICENAME, pDataName, &nbuf);
      packet.links_resize(4);
      packet(0) = (char*) pDataName; // todo use an efficient handle to name mapping
      free(pDataName);
      
      if(ri.header.dwType == RIM_TYPEMOUSE)
      {
        debug("RIM_TYPEMOUSE")
        packet(1) = (double) input_type::mouse;
        // packet value: <button, x, y, z=wheel_delta, device additional info and buttons raw state>
        packet(3).links_resize(5);
        packet(3)(1) = (double) ri.data.mouse.lLastX;
        packet(3)(2) = (double) ri.data.mouse.lLastY;
        packet(3)(4).links_resize(2);
        packet(3)(4)(0) = (double) ri.data.mouse.ulRawButtons;
        packet(3)(4)(1) = (double) ri.data.mouse.ulExtraInformation;
        
        // if more events are combined into one raw input, the events are splitted and fired independently
        // todo think if value type should be removed and value has always universal (at least for specific device type) structure and values filled properly
        // in such case value=<key/buttons bit mask up/down 0/1 (or key values with up/down distinct), x, y, z=wheel, ...other axis..., last=raw device data>
        
        // mouse movement
        if(ri.data.mouse.usFlags & MOUSE_MOVE_ABSOLUTE)
        {
          packet(2) = (double) input_value_type::absolute;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usFlags & MOUSE_MOVE_RELATIVE)
        {
          packet(2) = (double) input_value_type::relative;
          ihid->write(packet);
        }
        else
        {
          packet(2) = (double) input_value_type::undefined;
          packet(3)(0) = (double) ri.data.mouse.usFlags;
          ihid->write(packet);
        }
        
        // mouse buttons and wheel
        if(ri.data.mouse.usButtonFlags & RI_MOUSE_LEFT_BUTTON_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 1;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_LEFT_BUTTON_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 1;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_MIDDLE_BUTTON_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 2;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_MIDDLE_BUTTON_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 2;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_RIGHT_BUTTON_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 3;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_RIGHT_BUTTON_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 3;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_1_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 4;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_1_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 4;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_2_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 5;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_2_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 5;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_3_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 6;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_3_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 6;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_4_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 7;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_4_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 7;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_5_DOWN)
        {
          packet(2) = (double) input_value_type::down;
          packet(3)(0) = 8;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_BUTTON_5_UP)
        {
          packet(2) = (double) input_value_type::up;
          packet(3)(0) = 8;
          ihid->write(packet);
        }
        else if(ri.data.mouse.usButtonFlags & RI_MOUSE_WHEEL)
        {
          packet(2) = (double) input_value_type::relative;
          packet(3)(3) = (double)(signed SHORT) ri.data.mouse.usButtonData;
          ihid->write(packet);
        }
        else
        {
          packet(2) = (double) input_value_type::custom;
          packet(3) = (double) ri.data.mouse.usButtonFlags;
          ihid->write(packet);
        }
      }
      else if(ri.header.dwType == RIM_TYPEKEYBOARD)
      {
        debug("RIM_TYPEKEYBOARD")
        packet(1) = (double) input_type::keyboard;
        
        if(ri.data.keyboard.MakeCode & RI_KEY_MAKE)
        {
          packet(2) = (double) input_value_type::down;
        }
        else if(ri.data.keyboard.MakeCode & RI_KEY_BREAK)
        {
          packet(2) = (double) input_value_type::up;
        }
        
        packet(3).links_resize(4);
        if(ri.data.keyboard.MakeCode & RI_KEY_E0)
        {
          packet(3)(0) = 0;
        }
        else if(ri.data.keyboard.MakeCode & RI_KEY_E1)
        {
          packet(3)(0) = 1;
        }
        
        packet(3)(1) = (double) ri.data.keyboard.VKey;
        packet(3)(2) = (double) ri.data.keyboard.Message;
        packet(3)(3) = (double) ri.data.keyboard.ExtraInformation;
      }
      else if(ri.header.dwType == RIM_TYPEHID)
      {
        debug("RIM_TYPEHID")
        packet(1) = (double) input_type::hid;
        packet(2) = (double) input_value_type::custom;
        packet(3).links_resize(3);
        packet(3)(0) = ri.data.hid.dwSizeHid;
        packet(3)(1) = ri.data.hid.dwCount;
        
        packet(3)(2) = "";
        int size = ri.data.hid.dwSizeHid * ri.data.hid.dwCount;
        unsigned char* source = ri.data.hid.bRawData;
        packet(3)(2).resize(size * 2 + 1);
        const char * hexmap = "0123456789abcdef";
        for(int i = 0; i < size; ++i)
        {
          packet(3)(2)[i * 2 + 1] = hexmap[(source[i] >> 4) & 0x0F];
          packet(3)(2)[i * 2 + 2] = hexmap[source[i] & 0x0F];
        }
      }
      
      free(pData);
      ihid->write(packet);
    }
    break;
    case WM_INPUT_DEVICE_CHANGE:
      // todo
      switch(wParam)
      {
        debug("WM_INPUT_DEVICE_CHANGE")
        case GIDC_ARRIVAL:
          // todo
          debug("GIDC_ARRIVAL")
        break;
        case GIDC_REMOVAL:
          // todo
          debug("GIDC_REMOVAL")
        break;
        default:
        break;
      }
    break;
    default:
      debug("UNPROCESSED_MESSAGE")
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
  
  get(0);
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
  
  set(devices);
  
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
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
  
  // device buffer size is used to determine if set should register or unregister
  devices.resize(1);
  set(devices);
  if(0 == DestroyWindow(hWnd))
  {
    exception_throw_type(exception_type::undefined)
  }
}

//SERVICE_METHOD_DEFINITION(input_hid, start)
//{
//  thread::start();
//  return 0;
//}
//
//SERVICE_METHOD_DEFINITION(input_hid, stop)
//{
//  thread::stop();
//  return 0;
//}

SERVICE_METHOD_DEFINITION(input_hid, get)
{
  PRAWINPUTDEVICELIST prid;
  UINT ndev;
  
  UINT ret = GetRawInputDeviceList(prid, &ndev, sizeof(RAWINPUTDEVICELIST));
  if(ret != 0)
  {
    exception_throw_type(exception_type::undefined)
  }
  prid = (PRAWINPUTDEVICELIST) malloc(sizeof(RAWINPUTDEVICELIST) * ndev);
  if(prid == 0)
  {
    exception_throw_type(exception_type::undefined)
  }
  
  ret = GetRawInputDeviceList(prid, &ndev, sizeof(RAWINPUTDEVICELIST));
  if(ret == -1)
  {
    exception_throw_type(exception_type::undefined)
  }
  
//  return (void*) prid;
  devices = sequence();
  devices.links_resize(ndev);
  for(UINT i = 0; i < ndev; i++)
  {
    UINT nbuf;
    LPVOID pData;
    
    devices(i).links_resize(6);
    devices(i)(0) = prid[i].hDevice;
    devices(i)(1) = prid[i].dwType;
    
    GetRawInputDeviceInfo(prid[i].hDevice, RIDI_DEVICENAME, NULL, &nbuf);
    pData = malloc(nbuf);
    GetRawInputDeviceInfo(prid[i].hDevice, RIDI_DEVICENAME, pData, &nbuf);
    devices(i)(2) = (char*) pData;
    free(pData);
    
    GetRawInputDeviceInfo(prid[i].hDevice, RIDI_DEVICEINFO, NULL, &nbuf);
    pData = malloc(nbuf);
    GetRawInputDeviceInfo(prid[i].hDevice, RIDI_DEVICEINFO, pData, &nbuf);
    PRID_DEVICE_INFO pdinfo = (PRID_DEVICE_INFO) pData;
    if(pdinfo->dwType == RIM_TYPEMOUSE)
    {
      devices(i)(3) = 1;
      devices(i)(4) = 2;
      devices(i)(5).links_resize(4);
      devices(i)(5)(0) = pdinfo->mouse.dwId;
      devices(i)(5)(1) = pdinfo->mouse.dwNumberOfButtons;
      devices(i)(5)(2) = pdinfo->mouse.dwSampleRate;
      devices(i)(5)(3) = pdinfo->mouse.fHasHorizontalWheel;
    }
    else if(pdinfo->dwType == RIM_TYPEKEYBOARD)
    {
      devices(i)(3) = 1;
      devices(i)(4) = 6;
      devices(i)(5).links_resize(6);
      devices(i)(5)(0) = pdinfo->keyboard.dwType;
      devices(i)(5)(1) = pdinfo->keyboard.dwSubType;
      devices(i)(5)(2) = pdinfo->keyboard.dwKeyboardMode;
      devices(i)(5)(3) = pdinfo->keyboard.dwNumberOfFunctionKeys;
      devices(i)(5)(4) = pdinfo->keyboard.dwNumberOfIndicators;
      devices(i)(5)(5) = pdinfo->keyboard.dwNumberOfKeysTotal;
    }
    else if(pdinfo->dwType == RIM_TYPEHID)
    {
      devices(i)(3) = pdinfo->hid.usUsagePage;
      devices(i)(4) = pdinfo->hid.usUsage;
      devices(i)(5).links_resize(3);
      devices(i)(5)(0) = pdinfo->hid.dwVendorId;
      devices(i)(5)(1) = pdinfo->hid.dwProductId;
      devices(i)(5)(2) = pdinfo->hid.dwVersionNumber;
    }
    free(pData);
  }
  free(prid);
  
  return devices;
}

SERVICE_METHOD_DEFINITION(input_hid, set)
{
  BOOL ret;
  RAWINPUTDEVICE rid;
  
  rid.hwndTarget = hWnd;
  // device buffer size is used to determine if set should register or unregister
  if(0 != params.size())
  {
    rid.dwFlags = RIDEV_REMOVE;
  }
  else
  {
    rid.dwFlags = RIDEV_DEVNOTIFY | RIDEV_INPUTSINK;
  }
  rid.dwFlags = RIDEV_DEVNOTIFY | RIDEV_INPUTSINK;
  
  for(UINT i = 0; i < params.links_size(); i++)
  {
    rid.usUsagePage = params(i)(3);
    rid.usUsage = params(i)(4);
    ret = RegisterRawInputDevices(&rid, 1, sizeof(RAWINPUTDEVICE));
    if(!ret)
    {
      exception_throw_type(exception_type::undefined)
    }
  }
  
  return true;
}

#elif defined LINUX

input_hid::input_hid(SERVICE_METHOD_PARAMETERS)
{
}

input_hid::~input_hid()
{
}

#endif
