---
layout: page
title: "Q31776: Modified CALL INT86OLD Program"
permalink: /pubs/pc/reference/microsoft/kb/Q31776/
---

## Q31776: Modified CALL INT86OLD Program

	Article: Q31776
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 20-DEC-1989
	
	A correction should be made to Page 88 of the following manuals:
	
	1. "Microsoft QuickBASIC 4.00: BASIC Language Reference"
	
	2. "Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2:
	   BASIC Language Reference"
	
	In the CALL INT86OLD sample program on Page 88, the following line is
	incorrect:
	
	   INARY%(DX) = SADD("FOO.TXT" + CHR$(0))
	
	The line should be changed to the following:
	
	   temp$ = "FOO.TXT" + CHR$(0)
	   INARY%(DX) = SADD(temp$)
	
	In QuickBASIC Versions 4.00 and later, and in Microsoft BASIC Compiler
	Version 6.00, the SADD function only ACCEPTs a string variable as an
	argument, not a string expression.
	
	If you try to run the CALL INT86OLD sample program in the QB.EXE
	Version 4.00 editor, the "Expected: variable" error message appears
	unless you change the program as shown above.
	
	In QuickBASIC Version 3.00, the SADD function can take a string
	expression as its argument. In QuickBASIC Versions 4.00 and greater,
	the SADD function only can take a string variable (i.e. a simple
	string variable, or a single element of a string array).
	
	The example on Page 88 is a revised version of a program on Page 149
	of the QuickBASIC Version 3.00 manual.
