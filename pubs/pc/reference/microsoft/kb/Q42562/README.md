---
layout: page
title: "Q42562: Inconsistent Warnings: C4049 and C4024 in C and QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q42562/
---

## Q42562: Inconsistent Warnings: C4049 and C4024 in C and QuickC

	Article: Q42562
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_QuickC
	Last Modified: 1-JUN-1989
	
	When compiled with warning level one or higher, the following code
	produces a single warning under the C 5.10 compiler and an additional
	warning under QuickC 2.00:
	
	    /*  Inconsistent warning example
	     */
	    void fozzy( short foo, short *spud );
	    void winky( int   foo, int   *spud );
	
	    void main( void )
	    {
	        short sTest;
	        short sPoint;
	
	        fozzy( sTest, &sPoint );
	        winky( sTest, &sPoint );
	    }
	
	The warning emitted by both compilers is as follows:
	
	   warning C4049: 'argument' : indirection to different types
	
	QuickC also produces the following warning:
	
	   warning C4024: 'winky' : different types : parameter 2
	
	In both cases, the compilers dislike the second parameter in the call
	to winky. Winky is prototyped as accepting a pointer to an integer and
	is being passed a pointer to a short.
	
	These warnings are inconsistent because the compiler is not upset
	about winky being passed a short as its first parameter, when it has
	been prototyped as accepting an integer. If the compiler considers a
	short and an integer to be the same for the first parameter, pointers
	to these types should be considered the same for the second parameter.
	
	These generated warnings are expected behavior for both C and QuickC.
	Although integers and shorts are the same under Microsoft's
	implementation of C, they should not be considered to be the same. The
	only restriction on the size of the short given by the ANSI standard
	is that it not be longer than an integer. Code should be written with
	this in mind to maintain ANSI compatibility and prevent problems with
	future compilers, where integers might not be the same size as shorts.
