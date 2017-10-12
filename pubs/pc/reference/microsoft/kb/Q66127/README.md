---
layout: page
title: "Q66127: Using _psp for Pointer Checking"
permalink: /pubs/pc/reference/microsoft/kb/Q66127/
---

	Article: Q66127
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 17-OCT-1990
	
	Problem:
	
	I want to implement my own pointer checking routine. If the psp
	(program segment prefix) is set up in the lowest segment of available
	memory, then I should be able to use _psp as the lower bounds for
	legal pointer segments. However, if I write a program that compares
	_psp with pointer segments returned by malloc(), I get back segment
	values less than _psp.
	
	Response:
	
	When DOS loads an .EXE or .COM file, the psp is set up in the lowest
	segment of the largest contiguous block of available memory. There may
	be other blocks of available memory below the location of the psp;
	these blocks of memory are usually fairly small. If DOS returns one of
	these segments, when pointer checking is implemented with the /Zr
	option (available only with the /qc compiler option), the segment is
	simply discarded and DOS is called again. This process is repeated
	until a segment value greater than _psp is returned.
	
	You can implement a similar routine in any C program by making calls
	to a function, as demonstrated below, rather than making calls
	directly to malloc(). However, the start-up code still will make calls
	to malloc() directly for environment and argument space. Thus, the
	pointer segments for the environment and arguments may still be less
	than _psp. Further, it should be noted that this routine does not
	implement pointer checking; it only enables programmers to implement
	their own pointer checking by comparing segment values against _psp.
	
	Another method of getting only pointer segments greater than _psp is
	to modify the start-up code so that the value of _psp is stored at
	_aseglo. This is the actual location used to store the lower segment
	limit when pointer checking is implemented. The code to check the
	segment returned by DOS against this location, and to call DOS again
	if necessary, is already implemented. If it is necessary to have
	pointer segments for the environment and argument variables greater
	than _psp, a similar assignment can be used to modify the start-up
	code. If this assignment is done before the space for these variables
	is allocated in the start-up code, they will have segment values
	greater than _psp. However, you should be aware that Microsoft can
	make no guarantees about the implementation of this feature in any
	future releases.
	
	If a call to malloc() requires a new segment to be allocated from the
	operating system, the call to DOS will be made requesting only the
	amount of memory required by the malloc(). In subsequent calls,
	requests are made for 8K blocks of memory until no more memory is
	available from that segment. Since the blocks of memory below the psp
	are small, they may not be allocated during the first calls to
	malloc(). Thus, you cannot be sure exactly when these blocks of memory
	will be allocated.
	
	Code Example
	------------
	
	void * _new_malloc (size_t size)
	  {
	  void * temp_ptr;
	  temp_ptr= malloc (size);
	  while ((temp_ptr != NULL) && (FP_SEG(temp_ptr) < _psp))
	    temp_ptr= malloc (size);
	  return temp_ptr;
	  }
