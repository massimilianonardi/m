#include "output_manager_window.h"

SERVICE_EXPORT(output_manager_window)

#ifdef WIN32

sequence& get_window_data(HWND hWnd)
{
  return *(sequence*) GetWindowLongPtr(hWnd, GWLP_USERDATA);
}

HWND window_create(HWND parent, const sequence& data)
{
//  HWND hWnd = CreateWindow("output_manager_window_class", NULL, WS_POPUP, 0, 0, 0, 0, parent, NULL, GetModuleHandle(NULL), NULL);
  HWND hWnd = CreateWindow("output_manager_window_class", NULL, WS_CHILD, 0, 0, 0, 0, parent, NULL, GetModuleHandle(NULL), NULL);
//  CreateWindow("output_manager_window_class", NULL, WS_VISIBLE | WS_CHILD | WS_DLGFRAME, 100, 100, 200, 200, hWnd, NULL, GetModuleHandle(NULL), NULL);
  sequence* data_link = new sequence();
  data_link->links_ins(&data);
  SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG_PTR) data_link);
  SetWindowPos(hWnd, HWND_TOP, 100, 100, 200, 200, 0);
  ShowWindow(hWnd, SW_SHOW);
  UpdateWindow(hWnd);
  return hWnd;
}

HWND window_create_list(HWND parent)
{
//  HWND hWnd = CreateWindow(wc.lpszClassName, NULL, 0, 0, 0, 0, 0, parent, NULL, hInstance, NULL);
//  SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG_PTR) new sequence());
//  return hWnd;
}

INT window_paint(HWND hWnd)
{
  PAINTSTRUCT ps;
  HDC hdc = BeginPaint(hWnd, &ps);
  TextOut(hdc, 0, 0, "Hello, Windows!", 15);
  EndPaint(hWnd, &ps);
  
  return 0;
}

INT window_paint_background(HWND hWnd, HDC hdc)
{
  return 1;
}

LRESULT CALLBACK window_callback(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
  switch(message)
  {
    case WM_PAINT:
    {
      return window_paint(hWnd);
    }
    break;
    case WM_ERASEBKGND:
    {
//      return window_paint_background(hWnd, (HDC) wParam);
    }
    break;
    case WM_DESTROY:
    {
//      delete (sequence*) GetWindowLongPtr(hWnd, GWLP_USERDATA);
    }
    break;
    default:
//      debug("UNPROCESSED_MESSAGE")
    break;
  }
  
  return DefWindowProc(hWnd, message, wParam, lParam);
}

output_manager_window::output_manager_window(SERVICE_METHOD_PARAMETERS)
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
  wc.lpszClassName = "output_manager_window_class";
  
  wndClass = RegisterClass(&wc);
  if(!wndClass)
  {
    exception_throw_type(exception_type::creation_failed)
  }
  
  root_window = CreateWindow("output_manager_window_class", NULL, WS_VISIBLE | WS_CAPTION, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, GetModuleHandle(NULL), NULL);
}

output_manager_window::~output_manager_window()
{
  if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
  {
//    exception_throw_type(exception_type::undefined)
  }
}

SERVICE_METHOD_DEFINITION(output_manager_window, start)
{
  MSG msg;
  BOOL gmret;
  active = true;
  while(active)
  {
    gmret = GetMessage(&msg, NULL, 0, 0);
    if((gmret == -1) || (gmret == 0))
    {
      active = false;
      break;
    }
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, stop)
{
  active = false;
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, create)
{
//  window_type type;
//  HWND parent;
//  sequence data;
//  HWND hWnd;
//  
//  if(params.links_size() < 1) type = window_type::undefined;
//  else type = (window_type)(double) params(0);
//  
//  if(params.links_size() < 2) parent = root_window;
//  else parent = (HWND)(void*) params(1);
//  
//  if(params.links_size() < 3) data = sequence();
//  else data = &params(2);
//  
//  if(type == window_type::undefined)
//  {
//    hWnd = window_create(parent, data);
//  }
//  else if(type == window_type::list)
//  {
////    hWnd = window_create_list(parent, data);
//  }
//  else if(type == window_type::tree)
//  {
//  }
//  else if(type == window_type::net)
//  {
//  }
//  
//  return sequence();
//  return CreateWindow(wc.lpszClassName, NULL, 0, 0, 0, 0, 0, (HWND)(void*) params, NULL, hInstance, NULL);
//  sequence window
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, destroy)
{
  return DestroyWindow((HWND)(void*) params);
}

#elif defined LINUX
#endif
