// Return the middle of x, y, z
int middle(int x, int y, int z) {
    int m = z;
    if (y < z) {
       if (x < y)
           m = y;
       else if (x < z)
           m = y;
    } else {
        if (x > y)
            m = y;
        else if (x > z)
            m = x;
    }
    return m;
}                          

// Test driver
int main(int arc, char *argv[])
{
    int x = atoi(argv[1]);
    int y = atoi(argv[2]);
    int z = atoi(argv[3]);
    int m = middle(x, y, z);

    printf("middle: %d\n", m);

    return 0;
}
