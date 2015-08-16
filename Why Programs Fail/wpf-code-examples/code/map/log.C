#include "Map.h"
#include <assert.h>

int main() {
    Map map;
    map.add("Foo", 27);
    assert(map.lookup("Foo") == 27);
    map.add("Bar", 36);
    assert(map.lookup("Bar") == 36);
}
