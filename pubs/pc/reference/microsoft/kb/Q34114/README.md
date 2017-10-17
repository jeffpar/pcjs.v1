---
layout: page
title: "Q34114: &quot;Wrong Number of Dimensions&quot; When Declaring Arrays in COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q34114/
---

## Q34114: &quot;Wrong Number of Dimensions&quot; When Declaring Arrays in COMMON

	Article: Q34114
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The program below, when run inside the QuickBASIC Version 4.00 or
	4.00b editor, gives a "Wrong number of dimensions" error message and
	points to where the array w() is declared COMMON SHARED.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the QB.EXE that comes with the Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00
	and buglist6.00b). This problem was corrected in QuickBASIC Version
	4.50 and in QBX.EXE of the Microsoft BASIC Compiler Version 7.00
	(fixlist7.00).
	
	The program runs correctly if compiled with BC.EXE.
	
	The program runs correctly if one of the following workarounds is
	used:
	
	1. Variables and arrays in the second COMMON statements are in reverse
	   order.
	
	2. Arrays are made $DYNAMIC.
	
	3. Size of the arrays is changed.
	
	4. z19 is moved in front of w().
	
	The problem does not occur in QuickBASIC Version 3.00.
	
	The following is a code example:
	
	   DIM a(202), b(202), c(202), d(202), e(202)
	   DIM f(202), g(202), h(202), j(202), k(202)
	   DIM l(202), m(202), o(202), p(202), q(202)
	   DIM r(202), s(202), t(202), u(202), v(202)
	   DIM w(20), x(10)
	   COMMON z1, z2, z3, z4, z5, z6, z7, z8, z9, z10, a(), b(),_
	          c(), d(), e(), f(), g(), h(), j(), k(), l(), m()
	   COMMON z11, z12, z13, z14, z15, z16, z17, z18, o(), p(),_
	          q(), r(), s(), t(), u(), v(), w(), z19, x()
	   PRINT "Got this far ....."
