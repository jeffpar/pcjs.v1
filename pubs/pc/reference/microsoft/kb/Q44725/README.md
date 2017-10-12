---
layout: page
title: "Q44725: printf() and 512-Byte I/O Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q44725/
---

	Article: Q44725
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 15-AUG-1989
	
	Question:
	
	Why does the function printf() take up 512 bytes from the near heap
	(in small and medium memory model) when compiled with QuickC 2.00 but
	does not seem to take up any memory using C 5.10 or QuickC 1.01?
	
	Response:
	
	In QuickC 2.00, the standard I/O buffer gets allocated only when
	needed. This gives the program an extra 512 bytes of near heap space
	in small and medium memory model or an extra 512 bytes of far heap
	space in compact and large model. Therefore, when the printf()
	function is used for the first time, a 512-byte buffer is reserved
	for I/O, and the subsequent calls to printf() use that buffer.
	
	In C 5.10 and QuickC 1.01, a 512-byte buffer is always reserved at
	start-up. It doesn't matter if the program uses standard I/O or not.
	The buffer is also always allocated in the near heap, no matter what
	memory model is used.
	
	The following program prints the amount of space left in the near
	heap. When complied under C 5.10 or QuickC 1.01, the number is the
	same before and after the execution of printf().
	
	The program also uses _fheapwalk to show that C 5.10 and QuickC 1.01
	always allocate the buffer in the near heap in any memory model, and
	QuickC 2.00 allocates it in the near or far heap according to the
	memory model.
	
	When compiled under QuickC 2.00, the number printed after the printf()
	function is executed is 512 bytes fewer than the number printed before
	the execution of printf().
	
	#include <stdio.h>
	#include <math.h>
	#include <dos.h>
	#include <malloc.h>
	
	void heapdump (void);
	void main (void)
	{
	  unsigned n1, n2;
	
	  n1 = _memavl();
	  heapdump();
	  printf("first printf has been executed\n");
	  n2 = _memavl();
	  printf("space left in the near heap before printf %u\n",n1);
	  printf("space left in the near heap after printf %u\n",n2);
	  heapdump();
	}
	
	void heapdump (void)
	{
	  struct _heapinfo hinfo;
	  int heapstatus;
	
	  hinfo._pentry = NULL;
	  while ((heapstatus = _fheapwalk(&hinfo)) == _HEAPOK)
	  {
	     printf("%6s block at %p of size %d in the far heap\n",
	           (hinfo._useflag == _USEDENTRY ? "USED" : "FREE"),
	           hinfo._pentry, hinfo._size);
	  }
	  switch (heapstatus)
	  {
	    case _HEAPEMPTY:
	        printf("OK - empty far heap\n");
	        break;
	    case _HEAPEND:
	        printf("OK - end of far heap\n");
	        break;
	    case _HEAPBADPTR:
	        printf("ERROR - bad pointer\n");
	        break;
	    case _HEAPBADBEGIN:
	        printf("ERROR - bad start\n");
	        break;
	    case _HEAPBADNODE:
	        printf("ERROR - bad node\n");
	        break;
	  }
	}
