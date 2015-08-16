OBJECTS = demo.o Map.o ControlledMap.o

log:	log.o
	$(CXX) -o $@ log.o Map.o

log.o:	log.C Map.h

log.C:	demo
	./demo 2> $@

demo:	$(OBJECTS)
	$(CXX) -o $@ $(OBJECTS)

demo.o:	demo.C ControlledMap.h

Map.o:	Map.C Map.h

ControlledMap.o: ControlledMap.C ControlledMap.h Map.h
