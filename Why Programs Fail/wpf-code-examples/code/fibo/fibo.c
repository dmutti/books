/* fibo.c -- Fibonacci C program to be debugged */

#include <stdio.h>

int fib(int n)
{
    int f, f0 = 1, f1 = 1;

    while (n > 1) {
        n = n - 1; 
        f = f0 + f1;
        f0 = f1;
        f1 = f;
    }

    return f;
}

int main()
{
    int n = 9;

    while (n > 0)
    {
        printf("fib(%d)=%d\n", n, fib(n));
        n = n - 1;
    }

    return 0;
}
