---
layout: page
title: "Q26931: VAL(&quot;&amp;H&quot;) and VAL(&quot;%&quot;) Unexpectedly Returning Nonzero Value"
permalink: /pubs/pc/reference/microsoft/kb/Q26931/
---

## Q26931: VAL(&quot;&amp;H&quot;) and VAL(&quot;%&quot;) Unexpectedly Returning Nonzero Value

	Article: Q26931
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	When "&H", "&", and "%" are passed alone as arguments to the VAL
	function, VAL returns 0 (zero) as expected in QuickBASIC Version 3.00.
	In QuickBASIC Version 4.00, VAL returns a nonzero value for "&H" and
	"&", and returns a "type mismatch" (error 5) at run time for "%". VAL
	is expected to return 0 (zero) because "&H" is 0 in hexadecimal
	notation, "&" is 0 in long integer notation, and "%" is 0 in integer
	notation.
	
	Passing "&H0" or "0%" to VAL returns 0 as expected.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00, buglist6.00b). This problem was corrected in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 (fixlist7.00).
	
	If your program accepts input into a string variable and then uses
	VAL, you may want to filter out the character combinations that are
	not accepted. On the Microsoft QuickBASIC Versions 4.00 and 4.00b
	Utilities and Examples Disk in the \Source subdirectory there is a
	program called STRTONUM.BAS that filters out all characters from a
	string except numeric digits, the decimal point, and a minus sign.
	STRTONUM.BAS can be modified if you want to allow hexadecimal
	constants but exclude the special cases "&H" and "H" that return
	nonzero values from VAL. You can also write your own filtering
	routine.
	
	The presence of a coprocessor makes no difference. The following is
	a code example:
	
	' The following two statements print 203 in the QuickBASIC Version
	' 4.00 editor; they print 233 compiled to EXE with BRUN40.LIB, print
	' 1889 with BCOM40.LIB, and print 0 (zero) in QuickBASIC Version 3.00:
	
	PRINT VAL("&h")
	PRINT VAL("&")
	
	' The following statement gives "type mismatch" in QuickBASIC Version
	' 4.00 editor or EXE; it prints 0 (zero) in QuickBASIC Version 3.00:
	
	PRINT VAL("%")
