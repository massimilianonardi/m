//#include <cstdlib>
//#include <cstdio>
//#include <string>
//#include <sstream>
//using namespace std;
//#include <windows.h>
//
//#include "debug.h"
//#include "sequence.h"
//#include "buffer.h"
//#include "kernel.h"
//#include "sharedmemorystream.h"
#include "_sequence.h"
#include "sunaptos.h"

int main(int argc, char** argv)
{
  try
  {
    debug("[Process 00]")
//    sequence params;
    
    for(int i = 0; i < argc; i++)
    {
      debug("[Process 00] argument index: " << i << " - argument value: " << argv[i])
//      params << argv[i];
//      params << new sequence(argv[i]);
//      debug("[Process 00] argument index: " << i << " - argument loaded value: " << params[i].seq)
    }
    debug("[Process 00]")
    
    debug("size of sequence: " << sizeof(sequence))
    debug("size of buffer: " << sizeof(Buffer))
    debug("\n")
    
    // construct
    sequence s1;
    sequence s2 = sequence((int) 10002);
    sequence s3 = sequence((long) 10003);
    sequence s4 = sequence((long long) 10004);
    sequence s5 = sequence((float) 10005.1);
    sequence s6 = sequence((double) 10006.2);
    sequence s7 = sequence((long double) 10007.3);
    sequence s8 = sequence();
    sequence s9 = sequence("s9 init string");
    
    // assign construct
    s8 = "trallallero trallalla";
    s8 = 8.9;
    s8 = 5;
//    s8 = "";
    
    // log
    debug("s1: " << s1.text())
    debug("s2: " << s2.text())
    debug("s3: " << s3.text())
    debug("s4: " << s4.text())
    debug("s5: " << s5.text())
    debug("s6: " << s6.text())
    debug("s7: " << s7.text())
    debug("s8: " << s8.text())
    debug("s9: " << s9.text())
    
    // manipulate
    s8.resize(23);
    s8.resize(3);
    s8.resize(9);
    s8.resize(5);
    s8.get(0) = 42;
    s8.get(1) = 42;
    s8(0) = 21;
    s8(9) = 54;
    s8 << 49;
    s8 << "test9";
    s8(11) = "test11";
    s8(11)[1] = '_';
    s8(11)[2] = 126;
//    debug("s8: " << s8.text())
    s8.del(1);
    s8 >> 2;
//    debug("s8: " << s8.text())
    s8.get(5).size();
        
//    s8.get(3) = sequence(9);
//    s8.get(4) = 9;
//    s8.get(5) = "test";
    
//    s8(0) = 800;
//    s8(1) = 801;
//    s8(2) = 802;
////    s8(3) = sequence(9);
//    s8(3) = 803;
////    s8(4) = 9;
////    s8(5) = "test";
//    s8(9) = 10;
//    
//    s7(1) = 4;
//    s7(2) = (sequence) 5;
//    s7(2) = s7(1);
//    s7(3) = "test-s7";
    
    // stream
//    SharedMemoryStream sms = SharedMemoryStream("aaa", 1000000);
//    s8.write(sms);
//    s1.read(sms);
//    sms << s8;
//    sms >> s1;
    Sequence params, res;
//    params << "process" << "KernelMaster" << "0" << "a" << "0" << "a";
    params << "process" << "simple" << "0" << "a" << "0" << "a";
    debug("test 01")
//    Kernel* krn = 0;
    Kernel* krn = new Kernel(params);
    params.resize(0);
    debug("test 02")
//    Service* srv = 0;
//    DynamicLibraryLoader* dlib = new DynamicLibraryLoader("simple");
//    Service* srv = dlib->create(krn);
    params = "simple";
//    params = "boot";
//    Service* srv = dlm::i().create(params, 0);
//    Service* srv = dlm::i().create(params, krn);
//    Service* srv = krn->createLocal(params);
    res = krn->createLocal(params);
    Service* srv = res;
//    Service* srv = krn->f(Kernel::create, params);
    debug("test 03 srv=" << (long) srv << " res=" << (long)(Service*) res)
//    res = srv->f(0, params = "simple test 01");
    srv->f(0, params = "simple test 01");
    params = "key_001";
    debug("test 04 srv=" << (long) srv)
    ServiceServer* srvs = new ServiceServer(srv, params);
    debug("test 05")
    params = "key_001";
    debug("test 06")
    Service* srvc = new ServiceClient(params);
    srvc->f(0, params = "simple test 02");
    debug("test 07")
    
    // log
    debug("s1: " << s1.text())
    debug("s2: " << s2.text())
    debug("s3: " << s3.text())
    debug("s4: " << s4.text())
    debug("s5: " << s5.text())
    debug("s6: " << s6.text())
    debug("s7: " << s7.text())
    debug("s8: " << s8.text())
    debug("s9: " << s9.text())
    

    debug("[Process 90] [TERMINATION SUCCESSFUL]")
  }
  catch(const char* msg)
  {
    printf(msg);
    getchar();
  }
  catch(...)
  {
    debug("[Process 00] [Undefined Exception!]")
    getchar();
  }

  debug("[Process 99] [EXIT]")
  return 0;
}
