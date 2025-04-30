#include "OpenGLWindow.h"

#ifdef WIN32

LRESULT CALLBACK window_callback(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
  OpenGLWindow& om = *(OpenGLWindow*) GetWindowLongPtr(hWnd, GWLP_USERDATA);
  
  switch(message)
  {
    case WM_SIZE:
    {
      om.ogl.resize(LOWORD(lParam), HIWORD(lParam));
    }
    break;
    
    case WM_ACTIVATE:
    {
      if(!HIWORD(wParam))
      {
        // activate processing
//        om.ogl.start();
      }
      else
      {
        // pause processing
//        om.ogl.stop();
      }
      return 0;
    }
    break;
    
    case WM_SYSCOMMAND:
    {
      switch(wParam)
      {
        case SC_SCREENSAVE:
        case SC_MONITORPOWER:
          return 0;
      }
    }
    break;
    
    case WM_CLOSE:
    {
      om.stop();
      PostQuitMessage(0);
      return 0;
    }
    break;
    
    default:
//      debug("UNPROCESSED_MESSAGE")
    break;
  }
  
  return DefWindowProc(hWnd, message, wParam, lParam);
}

void OpenGLWindow::window_class_register()
{
  WNDCLASS wc;
//  wc.style = CS_OWNDC | CS_HREDRAW | CS_VREDRAW;
  wc.style = CS_OWNDC;
  wc.lpfnWndProc = window_callback;
  wc.cbClsExtra = 0;
  wc.cbWndExtra = 0;
  wc.hInstance = hInstance;
  wc.hIcon = LoadIcon(NULL, IDI_WINLOGO);
  wc.hCursor = LoadCursor(NULL, IDC_ARROW);
  wc.hbrBackground = NULL;
  wc.lpszMenuName = NULL;
  wc.lpszClassName = OPENGL_WINDOW_CLASS_NAME;
  
  hWC = RegisterClass(&wc);
  if(!hWC)
  {
    exception_throw_type(exception_type::creation_failed)
  }
}

void OpenGLWindow::window_class_unregister()
{
  if(0 == UnregisterClass(MAKEINTATOM(hWC), hInstance))
  {
//    exception_throw_type(exception_type::undefined)
  }
}

void OpenGLWindow::window_create()
{
  full_screen = false;
  
  hWnd = CreateWindow(OPENGL_WINDOW_CLASS_NAME, NULL, WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, GetModuleHandle(NULL), NULL);
  SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG_PTR) this);
  
  if(!(hDC = GetDC(hWnd)))
  {
    exception_throw_type(exception_type::undefined)
  }
  
  // set pixel format
  GLuint pfmt;
  PIXELFORMATDESCRIPTOR pfd;
  pfd.nSize = sizeof(PIXELFORMATDESCRIPTOR);
  pfd.nVersion = 1;
  pfd.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER | PFD_TYPE_RGBA;
  pfd.iPixelType = 32;
  pfd.cColorBits = 0;
  pfd.cRedBits = 0;
  pfd.cRedShift = 0;
  pfd.cGreenBits = 0;
  pfd.cGreenShift = 0;
  pfd.cBlueBits = 0;
  pfd.cBlueShift = 0;
  pfd.cAlphaBits = 0;
  pfd.cAlphaShift = 0;
  pfd.cAccumBits = 0;
  pfd.cAccumRedBits = 0;
  pfd.cAccumGreenBits = 0;
  pfd.cAccumBlueBits = 0;
  pfd.cAccumAlphaBits = 0;
  pfd.cDepthBits = 24;
  pfd.cStencilBits = 8;
  pfd.cAuxBuffers = 0;
  pfd.iLayerType = PFD_MAIN_PLANE;
  pfd.bReserved = 0;
  pfd.dwLayerMask = 0;
  pfd.dwVisibleMask = 0;
  pfd.dwDamageMask = 0;
  if(!(pfmt = ChoosePixelFormat(hDC, &pfd)))
  {
    exception_throw_type(exception_type::undefined)
  }
  if(!SetPixelFormat(hDC, pfmt, &pfd))
  {
    exception_throw_type(exception_type::undefined)
  }
  
  // create rendering context
  if(!(hRC = wglCreateContext(hDC)))
  {
    exception_throw_type(exception_type::undefined)
  }
  if(!wglMakeCurrent(hDC, hRC))
  {
    exception_throw_type(exception_type::undefined)
  }
  
  ShowWindow(hWnd, SW_SHOW);
}

void OpenGLWindow::window_destroy()
{
//  if(full_screen)
//  {
//    ChangeDisplaySettings(NULL, 0);
//    ShowCursor(TRUE);
//  }
  
  if(!wglMakeCurrent(NULL, NULL))
  {
//    exception_throw_type(exception_type::undefined)
  }
  if(!wglDeleteContext(hRC))
  {
//    exception_throw_type(exception_type::undefined)
  }
  hRC = NULL;
  
  if(!ReleaseDC(hWnd, hDC))
  {
//    exception_throw_type(exception_type::undefined)
  }
  hDC = NULL;
  
  if(0 == DestroyWindow(hWnd))
  {
//    exception_throw_type(exception_type::undefined)
  }
}

OpenGLWindow::OpenGLWindow()
{
  hInstance = GetModuleHandle(NULL);
  window_class_register();
}

OpenGLWindow::~OpenGLWindow()
{
  window_class_unregister();
}

void OpenGLWindow::runloop()
{
  // INIT ----------------------------------------------------------------------
  window_create();
  
  // init drawing
  ogl.init();
  
  // LOOP ----------------------------------------------------------------------
  MSG msg;
  while(thread::active)
  {
    ogl.draw();
    SwapBuffers(hDC);
    
    if(PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
    {
      TranslateMessage(&msg);
      DispatchMessage(&msg);
    }
    
//    BOOL gmret = GetMessage(&msg, hWnd, 0, 0);
//    // if error or posted quit message then stop
//    if((gmret == -1) || (gmret == 0))
//    {
//      thread::active = false;
//      break;
//    }
//    // todo verify that translate message can be removed
//    TranslateMessage(&msg);
//    DispatchMessage(&msg);
  }
  
  // END -----------------------------------------------------------------------
  ogl.end();
  
  window_destroy();
}

#elif defined LINUX
#endif
