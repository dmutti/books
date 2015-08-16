#ifndef _ELEMENT_H
#define _ELEMENT_H

class Element {
     int data;
     Element *peer;

public:
     Element (int d)
       : data(d), peer(0)
     {}

     int getData ()            { return data; }
     void setPeer (Element *p) { peer = p; }
     void resetPeer ()         { peer = 0; }

     void doSomeStuff () {
          if (peer != 0) {
              delete peer;
              resetPeer();
          }
     }

     virtual ~Element () {
        if (peer != 0 && peer->peer == this) {
           peer->resetPeer();
        }
     }
};

#endif
