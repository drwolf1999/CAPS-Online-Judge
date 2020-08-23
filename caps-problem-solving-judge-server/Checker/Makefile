GPP = g++
CFLAGS = -O3 --std=c++17

all: judger.o FastIO.o
	$(GPP) $(CFLAGS) -o answerChecker.o judger.o FastIO.o

# generate object file
judger.o: answerChecker.cpp
	$(GPP) $(CFLAGS) -c -o judger.o answerChecker.cpp

FastIO.o: FastIO.cpp
	$(GPP) $(CFLAGS) -c -o FastIO.o FastIO.cpp

# generate compiler
# clean object, executer files
clean:
	rm *.o *.out