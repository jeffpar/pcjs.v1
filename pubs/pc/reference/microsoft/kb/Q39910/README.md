---
layout: page
title: "Q39910: C4047 Error Message when Initializing Unions"
permalink: /pubs/pc/reference/microsoft/kb/Q39910/
---

	Article: Q39910
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-DEC-1988
	
	If an attempt is made to initialize the second element of a union at
	declaration time (rather than in the code), the following warning
	is generated:
	
	   C4047:'initialization' - different levels of indirection
	
	This error conforms to the ANSI standard, which assumes that the
	initialization is directed at the first element of the union, and
	reports, therefore, that the initializing values are of an incorrect
	type. If an attempt is made to initialize both the first and second
	element at declaration time, the same warning results.
	
	The following program demonstrates this error:
	
	-----------------------------------------------------------------
	union TEST {
	    struct{
	      int a;
	      int b;
	      int c;
	    } one;             /* union element #1 */
	    struct {
	      char *ptr1;
	      char *ptr2;
	      char *ptr3;
	      char *ptr4;
	   } two;             /* union element #2 */
	}u;
	
	char ch1[10], ch2[10], ch3[10],ch4[10] ;
	
	union TEST test ={{1,2,3},    /* initialize element #1*/
	                   {ch1,ch2,ch3,ch4} /* attempt to initialize #2 */
	                   };
	
	main()
	{
	}
	----------------------------------------------------------------
	
	The above program fails with the error C4047. The following
	initialization also fails with the same error:
	
	   union TEST test = {ch1,ch2,ch3,ch4}
	
	However, an attempt to initialize the first element of the union will
	be successful, as follows:
	
	   union TEST test = {1,2,3}
	
	If it is necessary to initialize the second element of a union, we
	suggest that you change the order of your union members, so that the
	element that requires initialization appears as the first element of
	the union.
