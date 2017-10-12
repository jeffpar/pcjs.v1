---
layout: page
title: "Q66778: Error Messages May Say "short" Instead of "enum""
permalink: /pubs/pc/reference/microsoft/kb/Q66778/
---

	Article: Q66778
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 26-NOV-1990
	
	Because an enumerated type is handled internally the same as a short
	type, certain Microsoft C compiler error messages may refer to a
	"short" even though the error involves an "enum". The following sample
	code contains an error to demonstrate this situation:
	
	   enum {A, B, C}      /* missing ';' at end */
	   double y;
	
	When the above code is compiled with the Microsoft C or QuickC
	compiler, the following error message is generated:
	
	   error C2139: type following 'short' is illegal
	
	In this particular case, the error should say
	
	   type following 'enum' is illegal"
	
	but the compiler does not keep track of whether or not an item was
	specified as an enum.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and
	buglist2.51). We are researching this problem and will post new
	information here as it becomes available.
