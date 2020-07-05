GPP = g++
CFLAGS = -O3 --std=c++17

# generate runfile

compiler: c.o cplusplus.o compiler.o
	$(GPP) $(CFLAGS) -o execute.out c.o cplusplus.o compiler.o

# generate object file

compiler.o: compiler.cpp
	$(GPP) $(CFLAGS) -c -o compiler.o compiler.cpp

# generate object file

judger.o: judger.cpp
	$(GPP) $(CFLAGS) -c -o judger.o judger.cpp

FastIO.o: FastIO.cpp
	$(GPP) $(CFLAGS) -c -o FastIO.o FastIO.cpp

# generate compiler
c.o: c.cpp interface.o
	$(GPP) $(CFLAGS) -c -o c.o c.cpp

cplusplus.o: cplusplus.cpp interface.o
	$(GPP) $(CFLAGS) -c -o cplusplus.o cplusplus.cpp

interface.o: include/compiler_interface.h
	$(GPP) $(CFLAGS) -c -o interface.o include/compiler_interface.h

# clean object, executer files
clean:
	rm *.o *.out