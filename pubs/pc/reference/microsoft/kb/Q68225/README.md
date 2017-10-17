---
layout: page
title: "Q68225: StringAssign of Zero-Length (Null) String Fails; BASIC 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q68225/
---

## Q68225: StringAssign of Zero-Length (Null) String Fails; BASIC 7.10

	Article: Q68225
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901016-16 S_C S_QuickC
	Last Modified: 15-JAN-1991
	
	There is no way to use the StringAssign routine to create a
	zero-length string. For example, the following gives unpredictable
	(bad) results, and should not be done:
	
	   StringAssign(NULL,0,basicstring,0)
	   // (The NULL pointer is defined in STDIO.H in Microsoft C.)
	
	This statement is NOT the same as the BASIC statement A$ = "". This
	article explains this limitation of the StringAssign routine, and
	gives the correct method to create a null BASIC string by using
	StringRelease.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The StringAssign routine lets you transfer far or near string data
	from one language's memory space to another, using the following C
	syntax:
	
	   StringAssign(sourceaddress&,sourcelength%,destaddress&,destlength%)
	
	StringAssign expects to receive a far pointer (sourceaddress&) either
	to a valid BASIC string descriptor or to the beginning of some string
	text. If the length of the source string (sourcelength%) is 0 (zero),
	StringAssign assumes that sourceaddress& is a pointer to a valid BASIC
	string descriptor. StringAssign then dereferences the descriptor and
	assigns the value to the destaddress& supplied.
	
	Each programmer is responsible for making sure that the pointer passed
	to StringAssign is valid. StringAssign doesn't validate the pointers.
	Thus, to pass the NULL pointer is an error. If the address passed does
	not point to a string descriptor, then the results will be
	unpredictable.
	
	Note: Someone might want to do this to set a BASIC variable-length
	string to the empty or null string from some other language. The
	intention is to simulate the following line of BASIC code:
	
	    A$ = ""
	
	To assign a null string, you can use the StringRelease routine.
	StringRelease isn't exactly the same as A$="", but it does result in a
	string descriptor that will be treated as a null string. It deletes
	the string data associated with the string descriptor and zeros the
	string descriptor. A string descriptor that contains 0 (zero) as the
	length and 0 (zero) as the offset is the same as an uninitialized
	string, which is treated as null. This method should work around the
	limitation of StringAssign described above.
	
	Code Example
	------------
	
	The following is an example of this workaround in Microsoft C and
	BASIC. To compile and link the program, you can use the following
	compile and link lines:
	
	   bc test1.bas /Fs /o /Zi ;
	   cl /c /AL /Zi test2.c ;
	   link /NOE /NOD /CO test1 test2,,,bcl71efr.LIB llibcer.lib;
	
	Note that the following program prompts you for input. If you input a
	string, then the C function will StringAssign the string. However, if
	you literally type "null" (with no quotation marks), then the function
	will use StringRelease to null the string.
	
	Test1.BAS -- BASIC Routine
	--------------------------
	
	DECLARE SUB cfunc CDECL (a$)
	CLS
	locate 10, 1
	print "Before call to cfunc"
	a$ = "This is a test"
	print "A$ = ", a$
	PRINT "Len A$: "; LEN(a$)
	print
	CALL cfunc(a$)    ' CALL the C function
	print "After call to cfunc"
	print "A$ = ", a$
	PRINT "Len A$: "; LEN(a$)
	print
	
	Test2.C -- C Routine
	--------------------
	
	#include <stdio.h>
	#include <stdlib.h>
	extern void far pascal StringAssign(char far *,int,char far *, int);
	extern void far pascal StringRelease(char far *);
	void cfunc(BasicString)
	     char far * BasicString;
	{
	    char name[80] ;
	    char NullStr[] = "";
	    printf("Input name[]: ");
	    scanf("%s",name);
	    if(stricmp(name,"null") == 0) {
	      name[0] = '\x00'; // Set it to null
	    }
	    if ((name == NULL) | (name[0] == '\x00')) {
	       StringRelease(BasicString);
	    } else {
	        StringAssign(name, strlen(name), BasicString,0);
	    }
	}
