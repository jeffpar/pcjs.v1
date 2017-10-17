---
layout: page
title: "Q36395: How to Use REM or ' Comments in DATA Statements without Error"
permalink: /pubs/pc/reference/microsoft/kb/Q36395/
---

## Q36395: How to Use REM or ' Comments in DATA Statements without Error

	Article: Q36395
	Version(s): 1.00 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_MQuickB B_GWBasicI B_BasicInt
	Last Modified: 13-DEC-1989
	
	If you want to append a comment [using REM or an apostrophe (')] to a
	DATA statement, you must put a colon (:) in front of the REM or
	apostrophe on the DATA line.
	
	This information applies to QuickBASIC Versions 1.00, 1.02, 2.00,
	2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2; Microsoft
	BASIC PDS Version 7.00 for MS-DOS and MS OS/2; to GW-BASIC Versions
	3.20, 3.22, and 3.23 for MS-DOS; to QuickBASIC Version 1.00 for the
	Apple Macintosh; to Microsoft BASIC Interpreter Versions 1.00, 1.01,
	2.00, 2.10, and 3.00 for the Apple Macintosh; and to Microsoft BASIC
	Compiler Version 1.00 for the Apple Macintosh. It may also apply to
	other versions of Microsoft BASIC not listed here.
	
	In QuickBASIC for MS-DOS, in Microsoft BASIC Compiler for MS-DOS and
	MS OS/2, and in GW-BASIC for MS-DOS, a READ statement that is accepted
	into a non-string variable produces a "Syntax error" if it encounters
	a comment [a REM or an apostrophe(')] without a preceding colon (:) in
	a DATA statement line.
	
	In QuickBASIC for Macintosh, you get a "Type Mismatch" error if you
	READ the comment (without a preceding colon) into a non-string
	variable when you run the program.
	
	In all above versions of BASIC (for all operating systems), the READ
	statement treats the comment as additional string data for input when
	it reads into a string variable.
	
	Correct Example
	---------------
	
	Separating the DATA statement from the REM (or apostrophe) with a
	colon (:) lets the program run correctly, as in the following example:
	
	   DATA abc,,def:  rem The second item is null.
	   DATA 1,,2:      ' The second item is null.
	   READ a$, b$, c$    ' Note that b$ is assigned to null string ("")
	   PRINT a$, b$, c$
	   PRINT
	   READ d, e, f       ' Note that e is assigned to 0
	   PRINT d, e, f
	   END
	
	Incorrect Example
	-----------------
	
	In the following program, the first READ statement reads the DATA
	statement's comment into c$ along with the last element ("def") of the
	DATA statement, which is not what the programmer may have wanted. The
	second READ statement produces a "Syntax error" in QuickBASIC, the
	BASIC compiler, and GW-BASIC for MS-DOS, and produces "Type Mismatch"
	in QuickBASIC and BASIC for the Apple Macintosh when it attempts to
	mistakenly read a (string) comment into a numeric variable:
	
	   DATA abc,,def  rem The second item is null. [This becomes data.]
	   DATA 1,,2      ' The second item is null. [This becomes data.]
	   READ a$, b$, c$    ' Note that b$ is assigned to null string ("")
	   PRINT a$, b$, c$
	   PRINT
	   READ d, e, f       ' This READ gives error while reading in f.
	   PRINT d, e, f
	   END
