---
layout: page
title: "Q30580: Declaring an Array of Pointers to Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q30580/
---

	Article: Q30580
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	How do I make an array that contains callable functions?
	
	Response:
	
	The following program is an example of building an array containing
	function addresses and calling those functions:
	
	test1() ;
	test2() ;            /*  Prototypes */
	test3() ;
	
	/* array with 3 functions */
	int (*functptr[])() = { test1, test2, test3 } ;
	
	main()
	{
	    (*functptr[0])() ;    /*  Call first function  */
	    (*functptr[1])() ;    /*  Call second function */
	    (*functptr[2])() ;    /*  Call third function  */
	}
	
	test1()
	{
	    printf ("hello 0\n") ;
	}
	
	test2()
	{
	    printf ("hello 1\n") ;
	}
	
	test3()
	{
	    printf ("hello 2\n") ;
	}
