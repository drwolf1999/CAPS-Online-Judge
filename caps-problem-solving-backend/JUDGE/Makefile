GPP = g++
CFLAGS = -O3
JUDGER_OBJ = judger.o

# generate runfile

judger: FastIO.o $(JUDGER_OBJ)
	$(GPP) $(CFLAGS) -o judger.exe FastIO.o $(JUDGER_OBJ)

# generate object file

$(JUDGER_OBJ): judger.cpp
	$(GPP) $(CFLAGS) -c -o $(JUDGER_OBJ) judger.cpp

FastIO.o: FastIO.cpp
	$(GPP) $(CFLAGS) -c -o FastIO.o FastIO.cpp

# clean object, executer files
clean:
	rm *.o *.exe