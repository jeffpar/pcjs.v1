#include <stdio.h>

int main()
{
    int n = 0x1234;
    printf("hello %5s\n", "world");
    printf("%#01x %#02x %#03x %#04x\n", n, n, n, n);
    printf("%#07x 0x%07x %#7x 0x%7x\n", n, n, n, n);
    return 0;
}
