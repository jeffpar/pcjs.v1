---
layout: page
title: "Q34921: The Proper Type for Pointer To jmp_buf Is void *"
permalink: /pubs/pc/reference/microsoft/kb/Q34921/
---

	Article: Q34921
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The setjmp() and longjmp() functions use a parameter of type jmp_buf.
	(The type jmp_buf is declared in setjmp.h.) Using the & operator
	("address of") on a variable of type jmp_buf generates the following
	message:
	
	warning C4046: '&' on function/array, ignored
	
	Leaving the ampersand (&) off and assigning the value to a
	variable badptr declared, as follows
	
	set_jmp *bad_ptr;
	
	generates the following message:
	
	warning C4047: '=' : different levels of indirection
	
	To solve the problem, declare the pointer to be of type void *,
	as follows:
	
	void *goodptr;
	
	Then, assign it without using the ampersand, as follows:
	
	goodptr = buf;
	
	Because the header file setjmp.h defines a jmp_buf as an array of
	integers, using the ampersand operator generates the warning described
	above. The reason for choosing an array type rather than a structure
	has to do with common C coding practices and is described in section
	4.6 of the Rationale for the ANSI C Standard.
	
	Basically, the setjmp() function must change the jmp_buf parameter in
	order to record where to come back to when longjmp() is executed.
	Elsewhere, the standard defines setjmp() as taking a single parameter
	of type jmp_buf, NOT of type "pointer to jmp_buf." The jmp_buf cannot
	be a structure because structures are passed by value and therefore
	could not receive changes made by setjmp(). Since arrays are passed by
	reference (i.e. by their address), setjmp() can change a parameter
	that is passed as an array.
	
	The declaration for badptr (below) declares it to be of type "pointer
	to array of integer," not "pointer to integer." Doing an assignment
	with different pointer types gives the C4047 warning error. (In order
	to do the assignment without a warning, badptr would have to be
	"pointer to integer" because that's the compatible pointer type for
	"array of integer.")
	
	Instead, using goodptr, declared "pointer to void," allows the
	assignment to be made without generating a warning. This is also
	portable code. Note that you cannot use indirection (or subscripting,
	which is a form of indirection) on void pointers.
	
	However, because you don't know what's in the jump buffer anyway, this
	should be no problem. (The contents of the jump buffer are
	implementation-dependent and could even differ from version to version
	of the same compiler. Any code that directly manipulates jump buffers
	is also implementation-dependent and non-portable.)
	
	A brief example program follows:
	
	#include <stdio.h>
	#include <setjmp.h>
	
	jmp_buf buf;
	jmp_buf *badptr;
	void *goodptr;
	
	main()
	{
	    badptr = &buf;
	        /*  warning C4046: '&' on function/array, ignored        */
	        /*  warning C4047: '=' : different levels of indirection */
	
	    badptr = buf;
	        /*  warning C4047: '=' : different levels of indirection  */
	
	    goodptr = buf;
	        /*    this works and is the proper way to do this!!!      */
	
	    exit(0);
	}
