#include <iostream>
#include <map>
#include <string>

using namespace std;

class Map {
    map<string, int> _map;

public:
    virtual void add(string key, int value);
    virtual void del(string key);
    virtual int lookup(string key);
    virtual ~Map() {}
};
