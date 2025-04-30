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
  
//  root_window = CreateWindow("output_manager_window_class", NULL, WS_VISIBLE | WS_CAPTION, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, GetModuleHandle(NULL), NULL);
  // start thread
  thread::start();
  // wait until windows message loop is created
  while(0 == PostThreadMessage(GetThreadId(h), WM_APP, 0, 0))
  {
    debug("waiting until windows message loop is created")
  }
  // setup virtual root window
  windows.links_resize(4);
  // create root window/desktop
  sequence root_window;
//  root_window.links_resize(4);
//  root_window(0) = &windows;
  create(root_window);
  // test creating some children
  debug_line
}

output_manager_window::~output_manager_window()
{
  if(0 == UnregisterClass(MAKEINTATOM(wndClass), hInstance))
  {
//    exception_throw_type(exception_type::undefined)
  }
}

void output_manager_window::runloop()
{
  MSG msg;
  BOOL gmret;
  // make windows create a message queue for this thread
//  PeekMessage(&msg, NULL, WM_APP, WM_APP, PM_REMOVE);
  // message loop
  while(active)
  {
    gmret = GetMessage(&msg, NULL, 0, 0);
    if((gmret == -1) || (gmret == 0))
    {
      active = false;
      break;
    }
    if(msg.hwnd == NULL)
    {
      int a = msg.message;
      debug(a)
      if(msg.message == WM_APP)
      {
        debug("WM_APP")
      }
      else if(msg.message == WM_APP+1)
      {
        debug("WM_APP+1")
//        sequence& window = *(sequence*) msg.lParam;
//        debug_line
        std::cout << msg.wParam << std::endl;
        std::cout << msg.lParam << std::endl;
//        long a=msg.lParam;
//        debug(a)
//        window.resize(0);
//        debug_line
//        debug(window.to_string())
      }
      else if(msg.message == WM_APP+2)
      {
        debug("WM_APP+2")
      }
      break;
    }
    TranslateMessage(&msg);
    DispatchMessage(&msg);
  }
}

SERVICE_METHOD_DEFINITION(output_manager_window, start)
{
  thread::start();
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, stop)
{
  thread::stop();
  
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, create)
{
  // params = window to create
  // params 0: sequence link to parent
  // params 1: handle of the window. now is 0, will be filled by the creator thread.
  // params 2: children windows
  // params 3: other window params
  // the following line removes constness from params (the link can access read-write)
//  sequence window = const_cast<sequence*>(&params);
//  // add child to the parent
//  window(0)(2).links_ins(&window);
//  // get persistent pointer to this window
//  sequence* ptr = &(window(0)(2)(window(0)(2).links_size()));
//  debug((long) ptr)
//  if(0 == PostThreadMessage(GetThreadId(h), WM_APP+1, 0, (LPARAM)(long) ptr))
  if(0 == PostThreadMessage(GetThreadId(h), WM_APP+1, 0, (LPARAM)(long) 5))
  {
//    exception_throw_type(exception_type::undefined)
  }
  return sequence();
}

SERVICE_METHOD_DEFINITION(output_manager_window, destroy)
{
  return DestroyWindow((HWND)(void*) params);
}

#elif defined LINUX
#endif
