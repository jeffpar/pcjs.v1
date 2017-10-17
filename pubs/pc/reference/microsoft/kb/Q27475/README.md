---
layout: page
title: "Q27475: Can't Pass QuickBASIC COMMON Block to FORTRAN"
permalink: /pubs/pc/reference/microsoft/kb/Q27475/
---

## Q27475: Can't Pass QuickBASIC COMMON Block to FORTRAN

	Article: Q27475
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-JUN-1989
	
	When passing a FORTRAN COMMON block to a compiled BASIC procedure, the
	first variable in the FORTRAN COMMON block is passed as a parameter in
	the CALL statement. The compiled BASIC procedure receives the variable
	as a user-defined type that corresponds to the COMMON block. This
	works when passing a FORTRAN COMMON block to a compiled BASIC
	procedure, but is not supported for passing a BASIC COMMON block to a
	FORTRAN routine, because FORTRAN does not support user-defined types.
	
	You cannot pass a COMMON block defined in a compiled BASIC procedure
	to a FORTRAN routine.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, and to the Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and OS/2.
