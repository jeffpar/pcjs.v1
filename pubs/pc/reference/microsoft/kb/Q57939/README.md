---
layout: page
title: "Q57939: Writing Optimized Dynamic Link Libraries (DDLs)"
permalink: /pubs/pc/reference/microsoft/kb/Q57939/
---

## Q57939: Writing Optimized Dynamic Link Libraries (DDLs)

	Article: Q57939
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 8-MAR-1990
	
	Problem:
	
	I have no problem building an /Od version of a DLL. However, I cannot
	build an /Ox optimized version. When I attempt to link the DLL, I get
	the following error:
	
	   LINK : error L2029: Unresolved externals:
	
	   __CIsin in file(s):
	    FOO.OBJ(foo.c)
	
	I am using the alternate math library as detailed in MTDYNA.DOC.
	
	Response:
	
	Your problem is caused by the compiler optimizing with intrinsics
	(/Oi). The function you get the unresolved external on is the
	intrinsic version of sin(). LLIBCDLL and all the alternate math
	libraries do not include ANY intrinsic math functions.
	
	To work around this, you have two options:
	
	1. Compile with /Oalt. The is the easiest because it requires no code
	   changes.
	
	2. Add the following line to your code for each function that is not
	   in LLIBCDLL and you can use /Ox for maximum possible optimization:
	
	      #pragma function({func1} {func2}...{funcN})
	
	   This tells the compiler to use the standard version instead of the
	   intrinsic version of these functions.
	
	For more information on the function pragma, see Page 94 in the
	"Microsoft C Optimizing Compiler: User's Guide."
