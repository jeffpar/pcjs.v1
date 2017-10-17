---
layout: page
title: "Q28023: MS Floating Point Is Faster Than BC /FPa Alternate Math"
permalink: /pubs/pc/reference/microsoft/kb/Q28023/
---

## Q28023: MS Floating Point Is Faster Than BC /FPa Alternate Math

	Article: Q28023
	Version(s): 6.00 6.00b 7.00  | 6.00 6.00b 7.00
	Operating System: MS-DOS           | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	An EXE compiled with the Alternate Math package (BC /FPa) performs
	floating-point calculations more slowly than an EXE compiled with
	QuickBASIC Versions 3.00 and 2.x Microsoft Floating Point.
	
	However, an EXE compiled with the alternate math package is between 40
	and 50 percent faster than an EXE compiled with IEEE Floating Point
	(with no /FPa switch) when run on a computer that does not have a
	coprocessor.
	
	Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 do not support
	Microsoft Floating Point. If you want the greatest floating-point
	speed on a computer that does not have a coprocessor, compile with the
	BC /FPa switch. ("FPa" stands for "Floating Point Alternate-Math
	Library"). If you want the greatest floating-point speed on a computer
	that has a coprocessor, compile with the BC /FPi switch. ("FPi" stands
	for "Floating Point In-line Instructions"). In-line Instructions is
	the default when you compile with BC and without /FPa or /FPi switch.
	
	Microsoft Floating Point is an older format found in the
	noncoprocessor version of QuickBASIC Version 3.00. It also is found in
	all prior versions of QuickBASIC (Versions 2.10, 2.00, 1.02, 1.01,
	1.00).
	
	Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft BASIC
	PDS Version 7.00 do not support Microsoft Floating Point. These
	products have adopted IEEE and Alternate Math in order to be linkable
	with FORTRAN, PASCAL, and C.
	
	Compiling with BC /FPa gives you the Alternate Math floating-point
	format. (The QuickBASIC interpreter uses only IEEE and cannot use
	Alternate Math.)
	
	Compiling without /FPa gives you IEEE floating-point format. IEEE
	floating-point format is fastest when run on a computer that has a
	coprocessor installed.
