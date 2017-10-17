---
layout: page
title: "Q27906: CALLing Pascal and FORTRAN Modules in QuickBASIC Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q27906/
---

## Q27906: CALLing Pascal and FORTRAN Modules in QuickBASIC Programs

	Article: Q27906
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	The following information is from the README.DOC disk file for
	Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2. This
	information also applies to BASIC compiler 6.00b, to Microsoft BASIC
	Professional Development System (PDS) Version 7.00, and to QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS (and is also found in the
	README.DOC disk file for all these products except BASIC PDS 7.00).
	
	Modules compiled with Microsoft Pascal or FORTRAN can be linked with
	compiled BASIC programs, as described in the "Microsoft Mixed-Language
	Programming Guide" (which comes with Microsoft Macro Assembler
	Versions 5.00 and 5.10 or Microsoft C Versions 5.00 and 5.10). These
	modules can also be incorporated in Quick libraries for use in the
	QuickBASIC QB.EXE or BASIC PDS 7.00 QBX.EXE environments. However,
	BASIC programs containing code compiled with Microsoft Pascal must
	allocate at least 2K of near-heap space for Pascal. This can be done
	using the DIM statement to allocate a static array of 2K or greater in
	the NMALLOC named common block, as shown in the following example:
	
	   DIM name%(2048)
	   COMMON SHARED /NMALLOC/ name%()
	
	The Pascal run time assumes it always has at least 2K of near-heap
	space available. If the Pascal code cannot allocate the required
	space, BASIC may hang. This applies to Pascal code in Quick libraries
	as well as to Pascal code linked into executable files. The situation
	is similar for FORTRAN I/O, which also requires near buffer space, and
	which can be provided by the same means as the Pascal near malloc
	space.
