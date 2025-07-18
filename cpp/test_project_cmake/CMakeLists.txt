
cmake_minimum_required(VERSION 3.28.3)

set(CMAKE_SOURCE_DIR src-test)
set(CMAKE_BINARY_DIR build-test)
set(CMAKE_CACHEFILE_DIR cache-test)

project(CMakeTestProject)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

#file(GLOB_RECURSE sources      main/*.cpp main/*.h)
file(GLOB_RECURSE sources      src/main/*.cpp src/main/*.h)
file(GLOB_RECURSE sources_test src/test/*.cpp)
file(GLOB_RECURSE data         resources/*)

add_executable(${PROJECT_NAME} ${sources} ${data})



# just for example add some compiler flags
target_compile_options(${PROJECT_NAME} PUBLIC -std=c++1y -Wall -Wfloat-conversion)

# this lets me include files relative to the root source directory with a <> pair
target_include_directories(${PROJECT_NAME} PUBLIC src/main)

# this copies all resource files in the build directory
# we need this, because we want to work with paths relative to the executable
file(COPY ${data} DESTINATION resources)



###############################################################################
## dependencies ###############################################################
###############################################################################

# this defines the variables Boost_LIBRARIES that contain all library names
# that we need to link to
#find_package(Boost 1.36.0 COMPONENTS filesystem system REQUIRED)

#target_link_libraries(${PROJECT_NAME} PUBLIC
#  ${Boost_LIBRARIES}
  # here you can add any library dependencies
#)



###############################################################################
## testing ####################################################################
###############################################################################

# this is for our testing framework
# we don't add REQUIRED because it's just for testing
#find_package(GTest)

#if(GTEST_FOUND)
#  add_executable(unit_tests ${sources_test} ${sources})

  # we add this define to prevent collision with the main
  # this might be better solved by not adding the source with the main to the
  # testing target
#  target_compile_definitions(unit_tests PUBLIC UNIT_TESTS)

  # this allows us to use our executable as a link library
  # therefore we can inherit all compiler options and library dependencies
#  set_target_properties(${PROJECT_NAME} PROPERTIES ENABLE_EXPORTS on)

#  target_link_libraries(unit_tests PUBLIC
#    ${GTEST_BOTH_LIBRARIES}
#    ${PROJECT_NAME}
#  )

#  target_include_directories(unit_tests PUBLIC
#    ${GTEST_INCLUDE_DIRS} # doesn't do anything on Linux
#  )
#endif()



###############################################################################
## packaging ##################################################################
###############################################################################

# all install commands get the same destination. this allows us to use paths
# relative to the executable.
install(TARGETS ${PROJECT_NAME} DESTINATION ${PROJECT_NAME}_destination)
# this is basically a repeat of the file copy instruction that copies the
# resources in the build directory, but here we tell CMake that we want it
# in the package
install(DIRECTORY resources DESTINATION ${PROJECT_NAME}_destination)

# now comes everything we need, to create a package
# there are a lot more variables you can set, and some
# you need to set for some package types, but we want to
# be minimal here
set(CPACK_PACKAGE_NAME "MyExample")
set(CPACK_PACKAGE_VERSION "1.0.0")

# we don't want to split our program up into several things
set(CPACK_MONOLITHIC_INSTALL 1)

# This must be last
include(CPack)
