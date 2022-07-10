#include "OpenGL.h"

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>

	// Create and compile our GLSL program from the shaders
//	GLuint programID = LoadShaders( "SimpleVertexShader.vertexshader", "SimpleFragmentShader.fragmentshader" );
	GLuint programID;

	// Get a handle for our buffers
//	GLuint vertexPosition_modelspaceID = glGetAttribLocation(programID, "vertexPosition_modelspace");
	GLuint vertexPosition_modelspaceID;

	static const GLfloat g_vertex_buffer_data[] = { 
		-1.0f, -1.0f, 0.0f,
		 1.0f, -1.0f, 0.0f,
		 0.0f,  1.0f, 0.0f,
	};

	GLuint vertexbuffer;

std::string load_file(const char *file_name)
{
  std::ifstream file(file_name);
  if(!file.is_open())
  {
    exception_throw_type(exception_type::undefined)
//    std::cout << "Unable to open file " << fname << std::endl;
//    exit(1);
  }
  
  std::stringstream data;
  data << file.rdbuf();
  file.close();
  
  return data.str();
}

void print_shader_info_log(GLint shader)
{
  int infoLogLen = 0;
  int charsWritten = 0;
  GLchar *infoLog;
  
  glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &infoLogLen);
  
  if(infoLogLen > 0)
  {
    infoLog = new GLchar[infoLogLen];
    // error check for fail to allocate memory omitted
    glGetShaderInfoLog(shader, infoLogLen, &charsWritten, infoLog);
    std::cout << "InfoLog : " << std::endl << infoLog << std::endl;
    delete [] infoLog;
  }
}

int load_shader(const char* pfilePath_vs, const char* pfilePath_fs, bool bindTexCoord0, bool bindNormal, bool bindColor, GLuint& shaderProgram, GLuint& vertexShader, GLuint& fragmentShader)
{
  shaderProgram=0;
  vertexShader=0;
  fragmentShader=0;
  
  // load shaders & get length of each
  int vlen;
  int flen;
  std::string vertexShaderString = load_file(pfilePath_vs);
  std::string fragmentShaderString = load_file(pfilePath_fs);
  vlen = vertexShaderString.length();
  flen = fragmentShaderString.length();
  
  if(vertexShaderString.empty())
  {
    return -1;
  }
  if(fragmentShaderString.empty())
  {
    return -1;
  }
  
  vertexShader = glCreateShader(GL_VERTEX_SHADER);
  fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
  
  const char *vertexShaderCStr = vertexShaderString.c_str();
  const char *fragmentShaderCStr = fragmentShaderString.c_str();
  glShaderSource(vertexShader, 1, (const GLchar **)&vertexShaderCStr, &vlen);
  glShaderSource(fragmentShader, 1, (const GLchar **)&fragmentShaderCStr, &flen);
  
  GLint compiled;
  
  glCompileShader(vertexShader);
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &compiled);
  if(compiled==FALSE)
  {
    std::cout << "Vertex shader not compiled." << std::endl;
    print_shader_info_log(vertexShader);
    
    glDeleteShader(vertexShader);
    vertexShader=0;
    glDeleteShader(fragmentShader);
    fragmentShader=0;
    
    return -1;
  }
  
  glCompileShader(fragmentShader);
  glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &compiled);
  if(compiled==FALSE)
  {
    std::cout << "Fragment shader not compiled." << std::endl;
    print_shader_info_log(fragmentShader);
    
    glDeleteShader(vertexShader);
    vertexShader=0;
    glDeleteShader(fragmentShader);
    fragmentShader=0;
    
    return -1;
  }
  
  shaderProgram = glCreateProgram();
  
  glAttachShader(shaderProgram, vertexShader);
  glAttachShader(shaderProgram, fragmentShader);
  
  glBindAttribLocation(shaderProgram, 0, "InVertex");
  
  if(bindTexCoord0) glBindAttribLocation(shaderProgram, 1, "InTexCoord0");
  if(bindNormal) glBindAttribLocation(shaderProgram, 2, "InNormal");
  if(bindColor) glBindAttribLocation(shaderProgram, 3, "InColor");
  
  glLinkProgram(shaderProgram);
  
  GLint IsLinked;
  glGetProgramiv(shaderProgram, GL_LINK_STATUS, (GLint *)&IsLinked);
  if(IsLinked==FALSE)
  {
    std::cout << "Failed to link shader." << std::endl;
    
    GLint maxLength;
    glGetProgramiv(shaderProgram, GL_INFO_LOG_LENGTH, &maxLength);
    if(maxLength>0)
    {
      char *pLinkInfoLog = new char[maxLength];
      glGetProgramInfoLog(shaderProgram, maxLength, &maxLength, pLinkInfoLog);
      std::cout << pLinkInfoLog << std::endl;
      delete [] pLinkInfoLog;
    }
    
    glDetachShader(shaderProgram, vertexShader);
    glDetachShader(shaderProgram, fragmentShader);
    glDeleteShader(vertexShader);
    vertexShader=0;
    glDeleteShader(fragmentShader);
    fragmentShader=0;
    glDeleteProgram(shaderProgram);
    shaderProgram=0;
    
    return -1;
  }
  
  return 1;
}

int load_shader(const char* pfilePath_vs, const char* pfilePath_fs)
{
  GLuint shaderProgram, vertexShader, fragmentShader;
  return load_shader(pfilePath_vs, pfilePath_fs, false, false, false, shaderProgram, vertexShader, fragmentShader);
}

OpenGL::OpenGL()
{
}

OpenGL::~OpenGL()
{
}

void OpenGL::init()
{
	// Initialize GLEW
	if (glewInit() != GLEW_OK) {
		fprintf(stderr, "Failed to initialize GLEW\n");
//		return -1;
	}
	programID = LoadShaders( "SimpleVertexShader.vertexshader", "SimpleFragmentShader.fragmentshader" );
//	programID = load_shader( "SimpleVertexShader.vertexshader", "SimpleFragmentShader.fragmentshader" );
	vertexPosition_modelspaceID = glGetAttribLocation(programID, "vertexPosition_modelspace");

	// Dark blue background
	glClearColor(0.0f, 0.0f, 0.4f, 0.0f);

	glGenBuffers(1, &vertexbuffer);
	glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(g_vertex_buffer_data), g_vertex_buffer_data, GL_STATIC_DRAW);
}

void OpenGL::end()
{
	// Cleanup VBO
	glDeleteBuffers(1, &vertexbuffer);
	glDeleteProgram(programID);
}

void OpenGL::resize(int x, int y)
{
  // todo
  if (y==0)										// Prevent A Divide By Zero By
  {
    y=1;										// Making Height Equal One
  }

  glViewport(0,0,x,y);						// Reset The Current Viewport

  glMatrixMode(GL_PROJECTION);						// Select The Projection Matrix
  glLoadIdentity();									// Reset The Projection Matrix

  // Calculate The Aspect Ratio Of The Window
  gluPerspective(45.0f,(GLfloat)x/(GLfloat)y,0.1f,100.0f);

  glMatrixMode(GL_MODELVIEW);							// Select The Modelview Matrix
  glLoadIdentity();									// Reset The Modelview Matrix
}

void OpenGL::draw()
{
		// Clear the screen
		glClear( GL_COLOR_BUFFER_BIT );

		// Use our shader
		glUseProgram(programID);

		// 1rst attribute buffer : vertices
		glEnableVertexAttribArray(vertexPosition_modelspaceID);
		glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
		glVertexAttribPointer(
			vertexPosition_modelspaceID, // The attribute we want to configure
			3,                  // size
			GL_FLOAT,           // type
			GL_FALSE,           // normalized?
			0,                  // stride
			(void*)0            // array buffer offset
		);

		// Draw the triangle !
		glDrawArrays(GL_TRIANGLES, 0, 3); // 3 indices starting at 0 -> 1 triangle

		glDisableVertexAttribArray(vertexPosition_modelspaceID);
}
