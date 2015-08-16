#include "Map.h"

using namespace std;

void Map::add(string key, int value)
{
    _map[key] = value;
}
    
void Map::del(string key)
{
    // no-op
}

int Map::lookup(string key)
{
    return _map[key];
}
