---
layout: page
title: "Q60496: FORTRAN 5.00 and C 6.00 Mixed-Language Considerations"
permalink: /pubs/pc/reference/microsoft/kb/Q60496/
---

	Article: Q60496
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | h_fortran
	Last Modified: 17-DEC-1990
	
	When doing mixed-language programming with Microsoft FORTRAN Version
	5.00 and C Version 6.00, it is necessary to use the FORTRAN
	C-compatible libraries.
	
	Also, when linking, the C 6.00 libraries should be placed first on the
	link line followed by the FORTRAN library.
	
	With C 5.10 and FORTRAN 5.00, it is possible to do mixed-language
	programming using the full libraries in both C and FORTRAN because the
	common routines between the two products are basically the same.
	However, this is not the case with C 6.00 and FORTRAN 5.00. The common
	routines often differ between the products, and the more recent
	versions must be used.
	
	In the FORTRAN 5.00 Setup program, you are given the option to build
	C-compatible libraries. Because these libraries do not contain the
	common routines, including much of the start-up code mentioned above,
	there is no problem linking them with the C 6.00 libraries. However,
	it is worth noting that these libraries can no longer be considered
	stand-alone FORTRAN libraries. They are only useful in conjunction
	with the C libraries. Finally, the C 6.00 libraries should be placed
	before the FORTRAN libraries on the linker command line.
	
	This information is also documented in "Advanced Programming
	Techniques," Chapter 12.3.2, Page 285.
