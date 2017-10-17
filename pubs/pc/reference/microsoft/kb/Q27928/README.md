---
layout: page
title: "Q27928: Routines Compiled /FPa (Alt. Math) Can't Be in Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q27928/
---

## Q27928: Routines Compiled /FPa (Alt. Math) Can't Be in Quick Library

	Article: Q27928
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 4-SEP-1990
	
	The linker error message "L2025: Symbol defined more than once" occurs
	when you attempt to create a Quick library (LINK /Q) from .OBJ modules
	that were compiled with the alternate math package (BC /FPa) option.
	
	Routines compiled with BC /FPa (the alternate math package switch)
	cannot be placed into a Quick library because the QB.EXE or QBX.EXE
	environment does not support the use of the alternate math package.
	The QuickBASIC and QuickBASIC extended environments support only the
	IEEE coprocessor-emulation math package (/FPi). The alternate math
	package (/FPa) is only supported in compiled EXE programs.
	
	This information applies to the QB.EXE environment supplied with
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS, and to
	the QBX.EXE environment supplied with Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10.
	
	The purpose of the alternate floating-point math package is to provide
	faster floating-point calculations on computers that do not have a
	coprocessor. The alternate math package is significantly faster than
	the IEEE coprocessor-emulation math package when run on a computer
	without a coprocessor installed.
	
	Note that the alternate math package is about 50 percent slower than
	the Microsoft Binary Format (MBF) floating-point math found in the
	noncoprocessor version of QuickBASIC versions 3.00 and earlier.
	(QuickBASIC versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler
	versions 6.00 and 6.00b, and Microsoft PDS versions 7.00 and 7.10 only
	offer support for the older MBF math with a /MBF compiler option and
	some MBF numeric conversion functions. These BASIC versions have
	adopted IEEE and alternate math to be compatible with the other
	Microsoft language products [FORTRAN, Pascal, and C] and to support
	the math coprocessor.)
	
	For the greatest speed, applications should be compiled with the BC
	/FPi switch and run on a computer with a coprocessor installed.
