cmake_minimum_required(VERSION 3.28.3)
project(CMakeTestProject)

file(GLOB_RECURSE sources      src/main/*.cpp src/main/*.h)
file(GLOB_RECURSE sources_test src/test/*.cpp)
file(GLOB_RECURSE data resources/*)

add_executable(example ${sources} ${data})
