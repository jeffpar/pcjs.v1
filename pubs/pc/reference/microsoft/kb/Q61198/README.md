---
layout: page
title: "Q61198: C 6.00 README: setjmp/longjmp with /Ox, /Oe, /Ol, or /Og"
permalink: /pubs/pc/reference/microsoft/kb/Q61198/
---

	Article: Q61198
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC file.
	
	Don't Use setjmp/longjmp with /Ox, /Oe, /Ol, or /Og
	---------------------------------------------------
	
	Using the setjmp and longjmp functions with global optimization
	options /Ox, /Oe, /Ol, or /Og can cause incorrect code to be
	generated. To ensure that the compiler generates correct code, either
	compile without these options, or use the optimize pragma to turn off
	/Oe, /Ol, and /Og in functions containing setjmp and longjmp, as
	follows:
	
	   #pragma optimize( "elg",off )
	
	        . . . {function containing setjmp or longjmp}
	
	   #pragma optimize( "",on )
