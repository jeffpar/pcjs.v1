---
layout: page
title: "Q31821: Structured Programming in Microsoft QuickBASIC - Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q31821/
---

## Q31821: Structured Programming in Microsoft QuickBASIC - Modules

	Article: Q31821
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-DEC-1989
	
	Easy modular programming is possible with Microsoft QuickBASIC by
	using separately compiled modules. BASIC programs no longer have to be
	developed as one large program; they can be written as separate,
	functionally grouped sets of subroutines that can be used in other
	programs.
	
	A module consists of an optional "main program" and a set of
	subprogram procedures. Data can be passed between linked modules by
	using subprogram parameters or named COMMON SHARED blocks. The named
	COMMON SHARED statement allows different groups of variables and
	arrays to be shared among the various modules in a single program. An
	example of a common block named GRAF3D is shown below:
	
	   DIM TRANSFORM3D(3,3) 'static array passed in COMMON
	   COMMON SHARED /GRAF3D/ CURX, CURY, CURZ, TRANSFORM3D()
	
	The SHARED attribute of the COMMON statement shares that COMMON among
	all subprogram procedures in that particular module. The variables in
	a COMMON without the SHARED attribute are only available at the main
	program level.
	
	An unnamed (blank) COMMON statement can pass information between
	CHAINed programs. (Named COMMON blocks are not carried across when you
	CHAIN to another QuickBASIC .EXE program.)
	
	Subprograms, separate compilation, COMMON blocks, and program CHAINing
	make Microsoft QuickBASIC a useful language for developing large
	application systems.
