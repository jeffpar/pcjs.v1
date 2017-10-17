---
layout: page
title: "Q38274: Single Precision &quot;Overflow&quot; when Nearing Divide By Zero;10E-38"
permalink: /pubs/pc/reference/microsoft/kb/Q38274/
---

## Q38274: Single Precision &quot;Overflow&quot; when Nearing Divide By Zero;10E-38

	Article: Q38274
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 9-DEC-1988
	
	The code example below produces an "OVERFLOW" error at n = 38 for
	QuickBASIC Versions 3.00, 4.00, and 4.00b, and BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2. The overflow occurs as you divide
	by ever larger numbers and approach the limits of the negative
	exponent for single precision. The program may overflow at different
	places in other versions of BASIC. To work around the "Overflow"
	error, use at least one double precision variable or constant in the
	expression before assigning to the variable.
	
	The following code example gives an "Overflow" error at n = 38:
	
	FOR n = 1 TO 100
	 x# = 1 / 10 ^ n
	 PRINT n, x#
	NEXT
	
	In the above program, the expression 1/10^n is optimized to use single
	precision, since the most precise argument in the expression is n,
	which defaults to single precision.
	
	To avoid the overflow of the negative single precision exponent,
	change n to double precision (n#). This forces the expression 1/10^n#
	to be stored in a double precision temporary storage area before being
	assigned to x#:
	
	FOR n# = 1 TO 100  ' This program runs fine from n#=1 through 100.
	 x# = 1 / 10 ^ n#
	 PRINT n#, x#
	NEXT
