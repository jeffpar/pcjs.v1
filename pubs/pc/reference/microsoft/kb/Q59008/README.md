---
layout: page
title: "Q59008: Bad Integer Output Using DEF FN, VAL, FOR-NEXT in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q59008/
---

## Q59008: Bad Integer Output Using DEF FN, VAL, FOR-NEXT in BASIC 7.00

	Article: Q59008
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900217-5 buglist7.00 fixlist7.10
	Last Modified: 1-AUG-1990
	
	When run as an .EXE program (compiled with BC.EXE), the program below
	gives incorrect output in Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and MS OS/2. The same program
	gives correct output when run in the QBX.EXE environment or compiled
	with the BC /D option.
	
	The program fails when it assigns an integer array (which is
	subscripted by a FOR...NEXT loop counter) to the VAL of a DEF FN
	string function operating on a temporary string that was assigned to
	an array element that is subscripted by the FOR...NEXT loop counter.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) version 7.00. This problem was
	corrected in BASIC PDS version 7.10.
	
	This problem does not occur with an .EXE compiled in QuickBASIC
	version 4.50 or earlier.
	
	The program below outputs "2 2" instead of "1 2" from an .EXE program.
	(The problem occurs whether compiled as a stand-alone .EXE or as an
	.EXE requiring the BRT module). This problem is corrected by doing any
	one of the following:
	
	1. Compiling with the BC /D option.
	
	2. Removing the DEFINT A-Z line.
	
	3. Replacing n (the ending value of the FOR...NEXT loop counter) with
	   the constant 2 in the FOR...NEXT statement.
	
	4. Eliminating the use of the temporary (placeholder) variable t$ by
	   putting s$(i) in place of it in the VAL function.
	
	5. Replacing d(i) with a nonarray (scalar) variable.
	
	Code Example
	------------
	
	   DEFINT A-Z
	   DIM s$(1 TO 2), d(1 TO 2)
	   DEF FNa$ (x$)
	   FNa$ = x$
	   END DEF
	   CLS
	   n = 2
	   s$(1) = "1"
	   s$(2) = "2"
	   PRINT
	   FOR i = 1 TO n
	      t$ = s$(i)
	      d(i) = VAL(FNa$(t$))
	   ' One workaround is to use:   d(i) = VAL(FNa$(s$(i)))
	      PRINT d(i);
	   NEXT
	   END
