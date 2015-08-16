#include <iostream>
#include "Map.h"

using namespace std;

class ControlledMap: public Map {
public:
    typedef Map super;

    ControlledMap()
    {
	clog << "#include \"Map.h\"" << endl
	     << "#include <assert.h>" << endl
	     << "" << endl
	     << "int main() {" << endl
	     << "    Map map;" << endl;
    }

    virtual void add(string key, int value)
    {
	clog << "    map.add(\"" << key << "\", " << value << ");" << endl;
	super::add(key, value);
    }

    virtual void del(string key)
    {
	clog << "    map.del(\"" << key << "\");" << endl;
	super::del(key);
    }

    virtual int lookup(string key)
    {
	clog << "    assert(map.lookup(\"" << key << "\") == ";
	int ret = super::lookup(key);
	clog << ret << ");" << endl;
	return ret;
    }

    ~ControlledMap()
    {
	clog << "}" << endl;
    }
};
