---
layout: page
title: "Q58522: Err Msg: C1064 Too Many _text Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q58522/
---

## Q58522: Err Msg: C1064 Too Many _text Segments

	Article: Q58522
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	Question:
	
	When I compile my program, I get a fatal error message "C1064 : too
	many _text segments". What is wrong?
	
	Response:
	
	This error is caused by using the alloc_text pragma to define more
	than 10 distinct _text segments in a single "compilation unit". The
	following code reproduces the error message:
	
	Sample Code
	-----------
	
	/*******************************/
	/* Define _text segments here. */
	/*******************************/
	
	#pragma alloc_text(foo_1,foofunct_1)
	#pragma alloc_text(foo_2,foofunct_2)
	    .
	    .
	    .
	#pragma alloc_text(foo_11,foofunct_11)
	
	/*******************************/
	/* Define Prototypes           */
	/*******************************/
	
	void main(void);
	void foofunct_1(void);
	void foofunct_2(void);
	    .
	    .
	    .
	void foofunct_11(void);
	
	/********************/
	/* Define functions */
	/********************/
	
	void main(void)
	{
	   printf("Here we go. Eleven alloc_text pragmas: \n");
	}
	
	void foofunct_1(void)
	{
	}
	void foofunct_2(void)
	{
	}
	    .
	    .
	    .
	void foofunct_11(void)
	{
	}
	
	See the "Microsoft C Optimizing Compiler: User's Guide" Version 5.1
	manual. The alloc_test pragma is detailed on Page 159. The error
	message (C1064) is documented in the "Microsoft C for MS-DOS and OS/2
	Operating Systems: Version 5.1 Update" on Page 59.
