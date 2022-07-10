#include "OpenGL.h"

OpenGL::OpenGL()
{
  glShadeModel(GL_SMOOTH);							// Enable Smooth Shading
  glClearColor(0.0f, 0.0f, 0.0f, 0.5f);				// Black Background
  glClearDepth(1.0f);									// Depth Buffer Setup
  glEnable(GL_DEPTH_TEST);							// Enables Depth Testing
  glDepthFunc(GL_LEQUAL);								// The Type Of Depth Testing To Do
  glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);	// Really Nice Perspective Calculations
  
//  if (height==0)										// Prevent A Divide By Zero By
//  {
//    height=1;										// Making Height Equal One
//  }

  glViewport(0,0,800,600);						// Reset The Current Viewport

  glMatrixMode(GL_PROJECTION);						// Select The Projection Matrix
  glLoadIdentity();									// Reset The Projection Matrix

  // Calculate The Aspect Ratio Of The Window
  gluPerspective(45.0f,(GLfloat)800/(GLfloat)600,0.1f,100.0f);

  glMatrixMode(GL_MODELVIEW);							// Select The Modelview Matrix
  glLoadIdentity();									// Reset The Modelview Matrix
}

OpenGL::~OpenGL()
{
}

void OpenGL::runloop()
{
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);	// Clear Screen And Depth Buffer
  glLoadIdentity();									// Reset The Current Modelview Matrix
  glTranslatef(-1.5f,0.0f,-6.0f);						// Move Left 1.5 Units And Into The Screen 6.0
  glBegin(GL_TRIANGLES);								// Drawing Using Triangles
    glVertex3f( 0.0f, 1.0f, 0.0f);					// Top
    glVertex3f(-1.0f,-1.0f, 0.0f);					// Bottom Left
    glVertex3f( 1.0f,-1.0f, 0.0f);					// Bottom Right
  glEnd();											// Finished Drawing The Triangle
  glTranslatef(3.0f,0.0f,0.0f);						// Move Right 3 Units
  glBegin(GL_QUADS);									// Draw A Quad
    glVertex3f(-1.0f, 1.0f, 0.0f);					// Top Left
    glVertex3f( 1.0f, 1.0f, 0.0f);					// Top Right
    glVertex3f( 1.0f,-1.0f, 0.0f);					// Bottom Right
    glVertex3f(-1.0f,-1.0f, 0.0f);					// Bottom Left
  glEnd();											// Done Drawing The Quad
}
