---
layout: page
title: "Q67035: DS Used Instead of Base Segment for Based Pointer Dereference"
permalink: /pubs/pc/reference/microsoft/kb/Q67035/
---

## Q67035: DS Used Instead of Base Segment for Based Pointer Dereference

	Article: Q67035
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 18-NOV-1990
	
	There are some situations where a based pointer will be incorrectly
	dereferenced in relation to the default data segment, rather than the
	segment on which the pointer is based. This problem occurs only with
	the QuickC Compiler or when the /qc (quick compile) option is used
	with the C Optimizing Compiler.
	
	The sample program below demonstrates this problem. When the code is
	compiled with C versions 6.00 or 6.00a and the /qc option, the value
	returned from the function is DS:0, instead of 0:0. By eliminating the
	/qc option, the expected value is returned.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51. We are researching this
	problem and will post new information here as it becomes available.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <stdlib.h>
	
	char far *get_address(void);
	
	void main(void)
	{
	    char far *addr;
	
	    addr = get_address();
	    printf("Address = %Fp -- Address expected = 0000:0000\n", addr);
	}
	
	char far *get_address(void)
	{
	    _segment base = 0;
	
	    return ( (char far *)(base:>NULL) );
	}
