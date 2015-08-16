#include <iostream>
using namespace std;

#include "Element.h"
#include "Container.h"

bool mode = true;  // (1)

int main (int argc, char *argv[]) {
     Element *a = new Element(1);
     Element *b = new Element(2);
     a->setPeer(b);
     b->setPeer(a);
     a->doSomeStuff();

     Container *c = new Container(10, mode);
     // c->add(b); // (2)
     c->add(a);
     c->add(b);

     cout << "result is: " << c->processElements() << '\n';

     delete c;
     return 0;
}
