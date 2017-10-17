---
layout: page
title: "Q41094: Huge Arrays Not Allowed in QuickC 2.00, But Huge Pointers Are"
permalink: /pubs/pc/reference/microsoft/kb/Q41094/
---

## Q41094: Huge Arrays Not Allowed in QuickC 2.00, But Huge Pointers Are

	Article: Q41094
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890209-11614 buglist2.00
	Last Modified: 28-FEB-1989
	
	The program below produces the following errors when compiled with
	QuickC Version 2.00, even when using huge-memory model (/AH):
	
	   prog.c(4) : error C2125: a : allocation exceeds 64K
	   prog.c(8) : error C2125: b : allocation exceeds 64K
	
	The following is the program:
	
	#include <stdio.h>
	
	short a[64000];
	
	main()
	{
	static short b[64000];
	}
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	"Huge support" for QuickC means that we perform proper arithmetic for
	huge items. It does not mean that we allow huge items to be
	declared -- only pointers to them.
	
	To work around this problem, declare the pointer, then use halloc to
	allocate the memory. The pointer will be addressed properly. Note: C
	Version 5.10 does allow declarations of huge items.
	
	Below is a sample program that demonstrates the workaround. Once
	memory for the array has been allocated, the pointer to the base type
	of the array may be treated exactly as you would have treated an
	array.
	
	The following is the program:
	
	#include <stdio.h>
	#include <stdlib.h>
	#include <malloc.h>
	
	#define MAX 33000L
	
	unsigned huge *a;
	
	void main(void)
	{
	unsigned huge *b;
	unsigned i;
	
	    a = halloc(MAX, sizeof(unsigned));  /* allocate "global" array */
	                /* IMPORTANT--make sure the allocations worked! */
	    if (!a) { puts("a is NULL");  exit(1);  }
	    b = halloc(MAX, sizeof(unsigned));  /* allocate "local" array */
	        if (!b) { puts("b is NULL");  exit(1);  }
	
	    for (i = 0; i < MAX; i++)  {    /* access memory as arrays */
	                a[i] = i;
	                b[i] = (unsigned)MAX - i - 1;
	        }
	
	    for (i = 0; i < MAX; i++)  {    /* check to make sure it's OK */
	                if (a[i] != i)  {
	                        printf("a[%u] is %u rather than %u\n",
	                                i, a[i], i);
	                        exit(2);
	                }
	                if (b[i] != (unsigned)MAX - i -1)  {
	                        printf("b[%u] is %u rather than %u\n",
	                                i, b[i], (unsigned)MAX - i -1);
	                        exit(2);
	                }
	        }
	        puts("Test passed");
	        exit(0);
	}
