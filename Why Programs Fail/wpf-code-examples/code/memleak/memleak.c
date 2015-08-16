/* Allocate and read in SIZE integers */
int *readbuf(int size)
{
    int *p = malloc(size * sizeof(int));
    for (int i = 0; i < size; i++)
    {
        p[i] = readint();
        if (p[i] == 0)
            return 0;  // end-of-file
    }

    return p;
}
