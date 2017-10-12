---
layout: page
title: "Q37233: Why "CDECL" Is Everywhere in Your Include Files"
permalink: /pubs/pc/reference/microsoft/kb/Q37233/
---

	Article: Q37233
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 26-OCT-1988
	
	Question:
	
	When I look at the include files provided with the Microsoft C
	compiler, I see all the function prototypes prefixed with "_CDECL".
	Why?
	
	Response:
	
	When Microsoft extensions are enabled, the manifest constant "_CDECL"
	takes the value "cdecl", which says that the associated function takes
	standard C calling conventions. (C calling conventions are used by
	default except when the /Gc switch is specified during compilation.
	The /Gc switch tells the compiler to default to FORTRAN/Pascal-style
	function calling and naming conventions.)
	
	Thus, the _CDECL's on the function prototypes tell the compiler to
	generate the runtime library function calls using C calling and naming
	conventions always--even if the /Gc option is used.
	
	For more information, see the "Mixed Language Programming Guide" and
	the "Microsoft C Language Reference."
