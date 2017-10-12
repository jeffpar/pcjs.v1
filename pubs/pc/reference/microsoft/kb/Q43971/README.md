---
layout: page
title: "Q43971: qsort(): Parameters to the Compare Function"
permalink: /pubs/pc/reference/microsoft/kb/Q43971/
---

	Article: Q43971
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 22-MAY-1989
	
	When you define or prototype a comparison function for the run-time
	library function qsort(), the formal parameters should be of type
	"pointer to the type of the array element." This is because qsort()
	passes the addresses of the array elements to the comparison function.
	
	If the declaration of the array to be sorted is
	
	   ELEMENT_TYPE arr[10] ;
	
	where ELEMENT_TYPE is the type of the array elements, then the
	function for comparison should be prototyped as follows:
	
	   int comp( ELEMENT_TYPE *, ELEMENT_TYPE * ) ;
	
	If arr is declared instead as an array of pointers to structure foo,
	then the declaration and prototype should be as follows:
	
	   struct foo * arr[10] ;
	   int comp( struct foo **, struct foo ** ) ;
