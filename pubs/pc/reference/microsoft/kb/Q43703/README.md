---
layout: page
title: "Q43703: Casting a Pointer to a Type Equivalent to a Multidimensional"
permalink: /pubs/pc/reference/microsoft/kb/Q43703/
---

	Article: Q43703
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	In some situations you may need to cast a pointer or an address to a
	type that is equivalent to a multidimensional array. The following
	example demonstrates such a situation:
	
	    typedef char Arr2Dim [][20] ;
	    void foo (Arr2Dim) ;
	    char * ptr ;
	    ...
	    void main (void)
	    {
	        ...
	        foo ( (Arr2Dim) ptr ) ;  /* illegal */
	        ...
	    }
	
	Casting the variable "ptr" to the array type "Arr2Dim" is illegal. The
	Microsoft C Compiler displays the following error message:
	
	   error C2067: cast to array type is illegal
	
	The correct procedure is to cast the pointer "ptr" to a pointer type
	equivalent to the array type Arr2Dim. This pointer type can be defined
	as follows:
	
	   typedef char (*Ptr2Dim) [20] ;
	
	Casting "ptr" to the type of "Ptr2Dim", as follows, is legal and
	produces no warning messages when compiled at warning level 3:
	
	   foo ( (Ptr2Dim) ptr ) ;
	
	The address (or pointer) passed to the function will be used
	correctly.
	
	A similar solution could be applied to the problem of dynamically
	allocating a multidimensional array. For example, the following code
	fragment will allocate a memory block, which can be used as a 10 x 20
	x 30 three-dimensional array:
	
	    typedef char (*Ptr3Dim) [20][30] ;
	    Ptr3Dim ptr3arr ;
	    ...
	    void main (void)
	    {
	        ...
	        ptr3arr = (Ptr3Dim) malloc (10 * sizeof(char) * 20 * 30) ;
	        ...
	    }
	
	After the allocation, "ptr2arr" can be used as a three-dimensional
	array, as follows, provided i, j, and k are integers within the proper
	range:
	
	   ptr2arr [i][j][k] = 'a' ;
