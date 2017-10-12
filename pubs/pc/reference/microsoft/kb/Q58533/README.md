---
layout: page
title: "Q58533: Offsetof() Macro Gives Incorrect Results or C1045"
permalink: /pubs/pc/reference/microsoft/kb/Q58533/
---

	Article: Q58533
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 13-FEB-1990
	
	The offsetof() macro, defined in stddef.h, does not work correctly
	with doubles or floats. It either gives incorrect results or it gives
	a C1045, floating-point overflow error. It is possible to work around
	this problem by defining your own macro to get the offset of a field
	in a structure.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	Typically, you get the offset of a structure by issuing the following
	statement
	
	   off = offsetof (struct foo, bar) ;
	
	where off is an unsigned integer (size_t), foo is a structure, and bar
	is a field in the structure foo. The difficulties occur when the field
	to which the offsetof() macro refers is a double or a float.
	
	The compiler generates the C1045 floating-point overflow error in some
	cases. It is possible to work around this by rearranging the contents
	of the structure to which offsetof() is referring.
	
	If the program compiles without giving fatal error C1045
	(floating-point overflow), then it will return zeros for all
	offsetof() references to the doubles or floats.
	
	Currently, the only way to work around the problem is to redefine the
	macro in the following way:
	
	extern int __zero ;
	
	#define NEWOFFSETOF(str,field)  (size_t)&(((str *)__zero)->field)
	
	The variable __zero should be set to 0 (zero) before any NEWOFFSETOF
	code is executed.
	
	As you can see, this method does work for statically initialized data.
	Because the new macro references a variable, the compiler cannot know
	what to initialize the data to. It is impossible to replace the
	variable __zero with an actual 0 (zero) because that is what the
	original macro is defined as.
	
	Defining the new macro to reference NULL allows you to statically
	initialize data, but it also gives the "floating-point overflow"
	error.
	
	Following is a sample program, which causes the error to occur:
	
	#include <stdio.h>
	#include <stddef.h>
	
	struct s
	{
	    short   a ;
	    double  b ;
	} ;
	
	void main (void)
	{
	    printf ("The offsets are %u and %u\n",
	            offsetof (struct s, a),
	            offsetof (struct s, b)) ;
	}
	
	The results of the program should be as follows:
	
	   The offsets are 0 and 2
	
	In fact, the output is (if it does compile) as follows:
	
	   The offsets are 0 and 0
	
	The program can be rewritten in the following manner:
	
	#include <stdio.h>
	#include <stddef.h>
	
	struct s
	{
	    short   a ;
	    double  b ;
	} ;
	
	#define NEWOFFSETOF(str,field)  (size_t)&(((str *)__zero)->field)
	
	int __zero = 0 ;
	
	void main (void)
	{
	    printf ("The offsets are %u and %u\n",
	            NEWOFFSETOF (struct s, a),
	            NEWOFFSETOF (struct s, b)) ;
	}
	
	The results are as follows:
	
	   The offsets are 0 and 2
