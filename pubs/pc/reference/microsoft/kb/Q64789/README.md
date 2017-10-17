---
layout: page
title: "Q64789: _outtext Can Produce Protection Violation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q64789/
---

## Q64789: _outtext Can Produce Protection Violation Error

	Article: Q64789
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 15-AUG-1990
	
	Under certain conditions, the C 6.00 version of _outtext can produce a
	protection violation. The error occurs when executing protected-mode
	programs compiled under the large and compact memory models. The
	following sample code illustrates the problem:
	
	Sample Code:
	
	/* Compile with any optimizations in large or compact model... */
	
	#include <stdio.h>
	#include <graph.h>
	#include <conio.h>
	
	char a1[10] = "boogie";
	char a2[10];
	
	void main(void)
	{
	   _outtext(a1);        // This _outtext works correctly
	   a2[0] = 'a';
	   a2[1] = 'b';         // Construct a null-terminated string
	   a2[2] = '\0';
	   _outtext(a2);        // Segmentation Violation occurs here
	}
	
	Three methods of working around this problem are listed below:
	
	1. Initialize the string (that is, char a2[10] = "\0";).
	
	2. Declare the string variable as a local variable rather than as a
	   global variable.
	
	3. Increase the number of elements in the character array. In the
	   large memory model, arrays in the range of 649 to 5,000 bytes in
	   size will work without problems. Arrays containing 643 to 5,000
	   bytes will work when compiling under the compact memory model.
	   (Arrays larger than 5,000 bytes may work also; however, this has
	   not been tested.)
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
