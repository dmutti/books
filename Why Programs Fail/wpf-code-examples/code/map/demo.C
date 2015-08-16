#include "ControlledMap.h"
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    ControlledMap map;

    string name;
    int price;

    cout << "Add items.  Type `.' to end." << endl;

    for (;;)
    {
	cout << "Name: ";
	cin >> name;
	if (name == ".")
	    break;

	cout << "Price: ";
	cin >> price;

	map.add(name, price);
	int stored_price = map.lookup(name);
	cout << "Added " << name << " at " << stored_price << endl;
    }
}
