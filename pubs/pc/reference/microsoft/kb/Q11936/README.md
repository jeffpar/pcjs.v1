---
layout: page
title: "Q11936: List of BASICs Using MBF versus IEEE Floating-Point Format"
permalink: /pubs/pc/reference/microsoft/kb/Q11936/
---

## Q11936: List of BASICs Using MBF versus IEEE Floating-Point Format

	Article: Q11936
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-FEB-1991
	
	This article lists which BASIC versions (for MS-DOS) use Microsoft
	Binary Format (MBF) and which versions use IEEE format for storing
	single- and double-precision floating-point numbers.
	
	Single- and double-precision real numbers are stored in the Microsoft
	Binary Format (MBF) in the following languages:
	
	1. QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, and the
	   non-coprocessor QB.EXE version 3.00, for MS-DOS
	
	2. IBM and Compaq BASICA Interpreters (BASICA.COM) for MS-DOS
	
	3. GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 (GWBASIC.EXE)
	   for MS-DOS
	
	4. Microsoft BASIC Interpreter version 5.28 for MS-DOS
	
	5. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS
	
	QuickBASIC versions 4.00, 4.00b, and 4.50 (QB.EXE, BC.EXE) and the
	coprocessor version of QuickBASIC version 3.00 (QB87.EXE) use IEEE
	floating-point format for single- and double-precision real numbers.
	
	Note that Microsoft Business BASIC Compiler versions 1.00 and 1.10 use
	a different floating-point format called Decimal Math. Decimal Math is
	very slow but has no rounding or representation errors because numbers
	are stored in their exact decimal form, instead of in an approximate
	binary form. (Sales of Business BASIC were discontinued.)
	
	In QuickBASIC version 3.00, the coprocessor version of QuickBASIC uses
	IEEE format numbers. Conversion routines are provided in version 3.00
	to convert between the MBF used in the non-coprocessor version
	(QB.EXE) and the IEEE floating-point format used in the coprocessor
	version (QB87.EXE).
	
	QuickBASIC versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler
	versions 6.00 and 6.00b, and Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 only use IEEE format numbers, but
	conversion routines and a compiler switch are provided to convert
	between MBF and IEEE format. This conversion is necessary if you want
	to retrieve floating-point numbers from random access files that were
	created using MBF.
	
	References:
	
	For additional articles that discuss MBF and IEEE, search for the
	following words:
	
	   floating and point and format and QuickBASIC
