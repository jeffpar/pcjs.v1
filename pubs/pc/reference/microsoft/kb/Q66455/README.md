---
layout: page
title: "Q66455: Problems May Occur When Passing the Same Array Element Twice"
permalink: /pubs/pc/reference/microsoft/kb/Q66455/
---

## Q66455: Problems May Occur When Passing the Same Array Element Twice

	Article: Q66455
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S901018-67 B_QuickBAS
	Last Modified: 12-NOV-1990
	
	The following program may give unexpected results when the same array
	element is passed twice to the subprogram. The problem results from a
	form of variable aliasing, where the same memory location is
	referenced by two different variables.
	
	To avoid aliasing problems, never pass the same variable twice in a
	given parameter list.
	
	Passing the same array element twice in the same parameter list can
	give incorrect or unexpected results regardless of array type or
	dynamic or static array allocation. The results may also vary between
	compiler versions. A customer reported that the program below gave the
	results that he wanted in QuickBASIC 4.00, but not in Microsoft BASIC
	Professional Development System (PDS) version 7.10; Microsoft has not
	confirmed this report.
	
	This behavior results from the fact the BASIC often requires a far
	pointer to access arrays, but parameters need to be passed as near
	pointers. On a CALL, BASIC sets aside a temporary location holding the
	array element and then passes a pointer to the temporary area.
	
	There are two options in this sort of situation: Recode the subprogram
	so that it is not necessary to pass the array element twice, or assign
	one of the parameters to a temporary variable and then pass the
	temporary variable.
	
	References:
	
	For a similar article on variable aliasing when a parameter is both
	SHARED and passed as a parameter to a subprogram, query in this
	Knowledge Base on the following words:
	
	   DYNAMIC and ARRAY and ALIASES
	
	A variable should not be passed twice in the list of arguments passed
	to a procedure; otherwise, variable-aliasing problems will occur. This
	restriction is documented under "The Problem of Variable Aliasing" on
	Page 64 in the "Microsoft BASIC 7.0: Programmer's Guide" for BASIC PDS
	versions 7.00 and 7.10, on Page 68 of the "Microsoft QuickBASIC 4.5:
	Programming in BASIC" manual, and on Page 78 of the "Microsoft
	QuickBASIC 4.0: Programming in BASIC: Selected Topics" manual for
	QuickBASIC versions 4.00 and 4.00b.
	
	Code Example
	------------
	
	   DECLARE SUB MakeUpper(instring AS STRING, outstring AS STRING)
	   DIM a$(15)
	   a$(4)="abcdefg"
	   CALL MakeUpper(a$(4), a$(4))
	   PRINT a$(4)
	   END
	
	   SUB MakeUpper(instring AS STRING, outstring AS STRING)
	     outstring = UCASE$(instring)
	   END SUB
