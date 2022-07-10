#include "input.h"
#include "functions.h"

SERVICE_REGISTER(input)
SERVICE_REGISTER_END

#ifdef WIN32

LRESULT CALLBACK window_callback(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
  debug_line
  switch(message)
  {
    case WM_INPUT:
      // todo
      debug("WM_INPUT")
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
}

input::input(SERVICE_METHOD_PARAMETERS)
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
  
//  get(0);
//  start(0);
//  sleepms(5000);
//  stop(0);
}

input::~input()
{
  if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
  {
    exception_throw_type(exception_type::undefined)
  }
}

void input::runloop()
{
  hWnd = CreateWindow(wc.lpszClassName, NULL, 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, hInstance, NULL);
//  ShowWindow(hWnd, SW_SHOW);
  if(hWnd == NULL)
  {
    if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
    {
      exception_throw_type(exception_type::undefined)
    }
    exception_throw_type(exception_type::creation_failed)
  }
  
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

SERVICE_METHOD_DEFINITION(input, start)
{
  thread::start();
  return 0;
}

SERVICE_METHOD_DEFINITION(input, stop)
{
  thread::stop();
  return 0;
}

SERVICE_METHOD_DEFINITION(input, get)
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

SERVICE_METHOD_DEFINITION(input, set)
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

input::input(SERVICE_METHOD_PARAMETERS)
{
}

input::~input()
{
}

void input::runloop()
{
}

SERVICE_METHOD_DEFINITION(input, start)
{
  thread::start();
  return 0;
}

SERVICE_METHOD_DEFINITION(input, stop)
{
  thread::stop();
  return 0;
}

SERVICE_METHOD_DEFINITION(input, get)
{
}

SERVICE_METHOD_DEFINITION(input, set)
{
}

#endif
