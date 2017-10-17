---
layout: page
title: "Q51865: /Zp4 Does Not Work with Standard Stream Handles"
permalink: /pubs/pc/reference/microsoft/kb/Q51865/
---

## Q51865: /Zp4 Does Not Work with Standard Stream Handles

	Article: Q51865
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 15-JAN-1991
	
	The Microsoft C compiler option /Zp4 (pack structures to four bytes)
	does not work correctly with the standard stream handles (stdin,
	stdout, stdaux, stderr, stdprn) when compiled under the large model.
	This happens with all optimizing compiler versions up to and including
	C 6.00a and QuickC compiler versions 2.00, 2.01, 2.50, and 2.51.
	
	To work around this problem, compile the STDIO.H header file with
	packing set to 1 or 2 bytes. This can be done with the #pragma pack(2)
	just before the #include <stdio.h>. After the include file is
	compiled, packing can be set back to 4 bytes with #pragma pack(4).
	Using this method allows for normal use of the standard devices.
	
	The following program will compile with /Zp4 /AL and run successfully:
	
	#pragma pack(2)
	#include <stdio.h>
	#pragma pack(4)
	
	#include <conio.h>
	
	void main(void)
	{
	  fprintf(stderr,"U1001: Syntax Error\n");
	  getch();
	}
	
	The reason STDIO.H must be compiled with packing set to 1 or 2 bytes
	is quite simple. The structure FILE is declared inside STDIO.H, but
	storage for the streams is not allocated. The stdin...stderr streams
	are assigned to an external array of stream file handles that were
	previously compiled inside the combined library with /Zp2 (the
	default). It becomes a simple case of linking two objects with
	different packing options.
	
	Microsoft has confirmed this to be a problem with C versions 5.10,
	6.00, and 6.00a; and QuickC versions 2.00, 2.01, 2.50, and 2.51
	(buglist2.00, buglist2.01, buglist2.50, and buglist2.51). We are
	researching this problem and will post new information here as it
	becomes available.
