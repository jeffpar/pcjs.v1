---
layout: page
title: "Q35432: &quot;Divide by Zero&quot; PRINT USING Double-Precision Format Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q35432/
---

## Q35432: &quot;Divide by Zero&quot; PRINT USING Double-Precision Format Overflow

	Article: Q35432
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 11-DEC-1989
	
	When a double-precision number with an exponent between 99 and 154
	overflows the format of a PRINT USING statement, a "Divide by zero"
	error can display instead of the percent (%) sign, indicating format
	overflow, or the program may hang without displaying an error. If the
	exponent is between 255 and 260, no error message displays, and an
	incorrect number is printed out. Similarly, if a double-precision
	number has an exponential power between -129 and -260, an incorrect
	number is printed, usually a number followed by a line of zeroes.
	
	The problems occur when run either in the QuickBASIC environment or
	from a compiled .EXE. The symptoms may include getting the "Divide by
	zero" error message, hanging, missing the percent sign, or getting
	incorrect PRINT USING output.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in QuickBASIC Version 4.50 and in  Microsoft
	BASIC Compiler Version 7.00 (fixlist7.00).
	
	To work around this incorrect handling of PRINT USING overflow, you
	can use a format large enough that does not overflow, as shown in a
	comment in the sample program below.
	
	The following code example shows the problem:
	
	'The following program prints 1.5*10^i, where i ranges from -308 to 308.
	'It should print in a uniform stream, but errors will occur when i
	'goes from -260 to -130, 99 to 154, and 255 to 260.
	ON ERROR GOTO foo
	FOR i = -308 TO 308
	   a# = 1.5# * (10# ^ i)
	   PRINT i; a#;
	   PRINT USING "###.###"; a#  ' This line shows problem.
	   ' PRINT USING "##.###^^^^^"; a#  ' Workaround: use ^ format.
	NEXT
	END
	foo:
	  PRINT "***************************************", ERR
	  'When i is between 99 and 154, you get ERR 11, "Division by zero".
	  RESUME NEXT
