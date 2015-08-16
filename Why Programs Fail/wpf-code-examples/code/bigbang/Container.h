#ifndef _CONTAINER_H
#define _CONTAINER_H

#include "Element.h"

class Container {
private:
     bool deleteElements;
     int size;
     Element **elements;

public:     
     Container(int sz, bool del)
       : size(sz), deleteElements(del)
     {
        elements = new Element *[size];
        for (int i = 0; i < size; i++)
           elements[i] = 0;
     }
     int processElements() {
	 int sum = 0;
          for (int i = 0; i < size; i++)
               if (elements[i])
                    sum += elements[i]->getData();

          return sum;
     }
     bool add(Element* e) {
        for (int i = 0; i < size; i++)
           if (elements[i] == 0) {
              elements[i] = e;
              return true;
           }

        return false;
     }
     virtual ~Container () {
        if (deleteElements)
          for (int i = 0; i < size; i++)
	    delete elements[i];

        delete elements;
     }
};
#endif
