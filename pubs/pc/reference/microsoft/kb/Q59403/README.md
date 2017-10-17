---
layout: page
title: "Q59403: BASIC &amp;num Constant Defaults to &amp;Onum (Octal), Not &amp;Hnum (Hex)"
permalink: /pubs/pc/reference/microsoft/kb/Q59403/
---

## Q59403: BASIC &amp;num Constant Defaults to &amp;Onum (Octal), Not &amp;Hnum (Hex)

	Article: Q59403
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_GWBasicC B_MQuickB B_BasicInt
	Last Modified: 15-MAR-1990
	
	In all versions of Microsoft BASIC products, the base for a literal
	constant that begins with an ampersand (&) alone (not &H, &h, &O, or
	&o) defaults to octal (equivalent to &O or &o). Thus, if you type a
	literal such as the following
	
	   &700
	
	then all versions of Microsoft BASIC will assume that this is an octal
	literal equivalent to &o700.
	
	In fact, many Microsoft BASIC Interpreters (such as GW-BASIC Versions
	3.20 and later for MS-DOS; QuickBASIC Versions 4.00 and later for
	MS-DOS; Microsoft BASIC Interpreter Versions 2.00, 2.10, and 3.00 for
	the Apple Macintosh; and QuickBASIC Version 1.00 for the Apple
	Macintosh) actually alter the literal to &o700 to show they are
	making this assumption.
	
	The octal default for a literal constant that begins with a lone
	ampersand (&) occurs in the following products:
	
	1. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	2. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	3. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	4. Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, 4.50 for MS-DOS
	
	5. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	6. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS
	
	7. Microsoft BASIC Professional Development System (PDS) Version 7.00
	   for MS-DOS and MS OS/2
	
	8. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	To demonstrate this feature of BASIC, enter the following code into
	the environment one of the BASIC interpreters, such as GW-BASIC or
	Microsoft QuickBASIC:
	
	   40 CLS
	   50 PRINT &700    ' This will print out as 448 (decimal value)
	   55 PRINT &o700   ' This will print out as 448 (decimal value)
	   60 PRINT &H700   ' This will print out as 1792 (decimal value)
	   70 END
	
	In many Microsoft BASIC interpreters (such as GW-BASIC 3.20 or later
	for MS-DOS; QuickBASIC 4.00 and later for MS-DOS; BASIC interpreter
	2.00, 2.10, and 3.00 for the Apple Macintosh; or QuickBASIC 1.00 for
	the Apple Macintosh), the editor automatically changes lines 50
	and 55 to the following:
	
	   50 PRINT &O700
	   55 PRINT &O700
	
	If you want a hexadecimal number, the & (ampersand sign) must be
	followed with H, as in line 60 above.
