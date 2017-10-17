---
layout: page
title: "Q37768: READ/DATA Statement Slower in QB 4.00 &amp; BC 6.00 Than QB 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q37768/
---

## Q37768: READ/DATA Statement Slower in QB 4.00 &amp; BC 6.00 Than QB 3.00

	Article: Q37768
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# G881102-5637 B_QuickBas
	Last Modified: 1-FEB-1990
	
	The following are two reasons why READ/DATA statements are slower in
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, Microsoft BASIC
	Professional Development System (PDS) Version 7.00, and QuickBASIC
	Versions 4.00, 4.00b, and 4.50 than in the noncoprocessor version of
	QuickBASIC Version 3.00:
	
	1. Math Package
	
	   The noncoprocessor version of QuickBASIC Version 3.00 (QB.EXE) uses
	   Microsoft Binary Format (MBF) for floating-point numbers, while
	   QuickBASIC Versions 4.x, Microsoft BASIC PDS, and the BASIC
	   compiler Versions 6.00 and 6.00b use IEEE. If a math coprocessor is
	   not present, the later compilers emulate one and, thus, are slower
	   than the noncoprocessor version of QuickBASIC 3.00.
	
	   To increase its speed without a coprocessor, the BASIC compiler
	   Versions 6.00 and 6.00b and Microsoft BASIC PDS Version 7.00
	   provide support for the alternate math library. Alternate math is a
	   subset of IEEE and is 40 to 50 percent faster than emulating a math
	   coprocessor (but is still slower than MBF). To use alternate math,
	   compile with the BC /FPa switch. Note that the alternate math
	   library is not supported in Microsoft QuickBASIC Compiler Versions
	   1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, or 4.50.
	
	2. Microsoft rewrote the code for READ and DATA statements to support
	   both the QB.EXE 4.00, 4.00b, and 4.50 environment and separate
	   compilation in the BC.EXE BASIC compiler. QuickBASIC 3.00 is highly
	   dependent upon a particular format and location for DATA
	   statements. In QuickBASIC 4.00 and later, and in the QuickBASIC
	   extended environment included with Microsoft BASIC PDS Version
	   7.00, the support is generalized to allow for DATA statements in
	   Quick libraries.
