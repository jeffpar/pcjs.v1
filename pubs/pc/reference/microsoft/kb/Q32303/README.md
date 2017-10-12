---
layout: page
title: "Q32303: Assert Macro Anomaly; Generating Syntax Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q32303/
---

	Article: Q32303
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 5-JUL-1988
	
	The following code demonstrates an anomaly with the C Version 5.10
	compiler when compiled with the default options. Compile-time syntax
	warnings are generated when there are no apparent syntax errors.
	
	#include <stdio.h>
	#include <assert.h>
	main()
	{
	  if(1)
	  assert(1+1);
	  else
	  assert(1+2);
	}
	
	Response:
	   The syntax errors are generated because assert() is implemented as
	a macro and is expanded to the following form:
	
	    if (!(1+1)) { \
	        fprintf(stderr, _assertstring, #1+1, __FILE__, __LINE__); \
	        fflush(stderr); \
	        abort(); \
	        } \
	    }
	
	   When this macro is placed inside an if else conditional, the
	closing brace of the macro is seen as a syntax error.
	   Although the syntax for the if else conditional in the above
	example is legal, it does not make much sense for use with assert
	because assert will call the abort function if it is true. Therefore,
	you can accomplish the same results with the following program:
	
	#include <stdio.h>
	#include <assert.h>
	main()
	{
	  if(1)
	  assert(1+1);
	  assert(1+2);
	}
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
