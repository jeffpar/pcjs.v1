---
layout: page
title: "Q26637: ASCII 0, 1, and 2 Control Character Problems in DATA Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q26637/
---

## Q26637: ASCII 0, 1, and 2 Control Character Problems in DATA Statement

	Article: Q26637
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 17-JAN-1991
	
	BASIC is not designed to support ASCII 0, 1, or 2 byte values (control
	characters) embedded in a DATA statement or in a quoted string, such
	as the following statements using ASCII 1 (CTRL+P+A) and 2 (CTRL+P+B)
	typed into the QB.EXE or QBX.EXE editor:
	
	   DATA CTRL+P+A, CTRL+P+B
	or
	   DATA "CTRL+P+A", "CTRL+P+B"
	
	(Note that the QB.EXE or QBX.EXE editor does not allow you to enter a
	byte value of 0 into the source code, but you can enter a byte value
	of 1 with CTRL+P+A and 2 with CTRL+P+B. The CTRL+P feature for
	entering control characters is a feature specific to the QB.EXE or
	QBX.EXE editor. ASCII 1 looks like a smiling face; ASCII 2 looks like
	an inverse video smiling face; when displayed in DOS using the TYPE
	command, ASCII 0 looks like ASCII 32, a blank space.)
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00, and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10.
	
	The BC.EXE compiler correctly strips out all control-character byte
	values equal to 0, 1, or 2 from DATA statements in the source file.
	(The BC.EXE compiler uses ASCII 1 and 2 byte values internally to mean
	end-of-statement and end-of-line). Currently, the above DATA
	statements behave like the following DATA statements when run as an
	.EXE program:
	
	   DATA ,
	or
	   DATA "",""
	
	To work around this limitation in .EXE programs compiled with BC.EXE,
	you should not READ into string variables the ASCII byte values
	(control characters) of 0, 1, and 2 in DATA statements; instead, use
	numeric constants and READ into a numeric variable, as shown in the
	workaround example at the bottom of this article.
	
	The QB.EXE or QBX.EXE editor is more lenient than BC.EXE in supporting
	0, 1, and 2 bytes in DATA statements. The QB.EXE editor in QuickBASIC
	versions 4.00 and 4.00b correctly loads DATA statements containing
	ASCII 1 or 2 control codes, but you get "Out of data" at run time for
	ASCII 1 unless you READ into a string variable and put
	double-quotation  marks around the ASCII 1 byte value. QB.EXE in
	QuickBASIC 4.50 and QBX.EXE in BASIC PDS 7.00 and 7.10 allow ASCII 1
	to be read into a string variable with or without quotation marks in
	the DATA statement; but attempting to read ASCII 1 into a numeric
	variable correctly gives "Syntax error."
	
	Example 1
	---------
	
	This example shows BC.EXE limitations using ASCII values 1 and 2 in
	quoted strings:
	
	FOR j = 1 TO 2
	READ Y$
	PRINT Y$    'Prints OK in QB.EXE/QBX.EXE; but "null string" in BC.EXE
	IF Y$="" THEN PRINT "This DATA item is a null string"
	NEXT
	' The following DATA statement will give errors in BC.EXE at compile
	' time if the source file was saved in Fast Load format, no BC.EXE error
	' at compile time if saved as Text format. For a separate article
	' that discusses this problem, query on the following words:
	'    FAST and LOAD and "UNRECOGNIZABLE STATEMENT"
	' You can type ASCII byte values of 1 and 2 into the QB.EXE or
	' QBX.EXE editor by pressing the CTRL (control) characters shown
	' in quoted strings:
	DATA "CTRL+P+A", "CTRL+P+B"
	
	Example 2
	---------
	
	This example shows that you should not READ control code bytes into a
	numeric variable, since you get "syntax error" in QB.EXE 4.50 and
	QBX.EXE 7.00/7.10, and "Out of Data" in QB.EXE 4.00 and 4.00b (and in
	QB.EXE shipped with BASIC compiler 6.00 and 6.00b).
	
	This example uses ASCII 1, 2, and 3 byte values typed directly into
	the DATA statement without surrounding quotation marks (""):
	
	PRINT
	FOR j = 1 TO 3
	READ X  ' Error occurs here for READing any control bytes in QB.EXE or
	        ' QBX.EXE at run time.
	' From .EXE at run time, this program prints 0 for both
	' ASCII 1 and 2 since ASCII 1 and 2 are stripped out at compile time.
	' The .EXE program gives an error for ASCII 3, since it is
	' incorrectly being read into a numeric variable. You must read
	' control characters like ASCII 3 through 31 into a string variable,
	' as shown in Example 2b.
	PRINT X; CHR$(X)
	NEXT
	' The following DATA statement will give errors in BC.EXE at compile
	' time if the source file was saved in Fast Load format, no BC.EXE error
	' at compile time if saved as Text format. For a separate article
	' that discusses this problem, query on the following words:
	'    FAST and LOAD and "UNRECOGNIZABLE STATEMENT"
	' You can type ASCII byte values of 1 and 2 into the QB.EXE or
	' QBX.EXE editor by pressing the CTRL (control) characters shown
	' (don't use quotation marks in this example).
	DATA CTRL+P+A, CTRL+P+B, CTRL+P+C
	
	Example 2b
	----------
	
	This example works in all versions of BASIC mentioned in this article
	(however, in QuickBASIC 4.00 and 4.00b and in BASIC compiler 6.00 and
	6.00b, you must type the control codes inside double-quotation marks
	or else you get "Out of Data".) This example successfully READs the
	ASCII control codes 3, 4, 5, and 6 into a string variable:
	
	FOR J=1 TO 4
	READ Y$
	PRINT Y$
	NEXT
	' Type the following control codes with or without quotation marks in
	' QB.EXE 4.50 or in QBX.EXE 7.00/7.10. In QB.EXE 4.00 and 4.00b, you
	' must type the control codes inside double-quotation marks or else
	' you get "Out of Data".
	DATA CTRL+P+C, CTRL+P+D, CTRL+P+E, CTRL+P+F
	
	Example 3
	---------
	
	The following program creates a BASIC source file called TEST.BAS,
	which has a null (0) byte in quotation marks in a DATA statement. This
	program is necessary to show the problem since you can't type a null
	byte directly into a source file with QB.EXE or QBX.EXE. Run the
	following program to create TEST.BAS:
	
	   OPEN "test.bas" FOR OUTPUT AS #1
	   PRINT #1, "FOR j = 1 TO 3"
	   PRINT #1, "READ Y$   "
	   PRINT #1, "PRINT Y$, LEN(Y$)"
	   PRINT #1, "NEXT"
	   a$ = CHR$(34)
	   b $= "DATA " + a$ + CHR$(0) + a$ + "," + a$ + CHR$(1) + a$ + ","
	   b$ = b$+ a$ + CHR$(2) + a$
	   PRINT #1, b$
	   CLOSE
	
	TEST.BAS is now created, and appears as follows if you display it at
	the DOS prompt using the TYPE command:
	
	   FOR j = 1 TO 3
	   READ Y$
	   PRINT Y$, LEN(Y$)
	   NEXT
	   DATA "<null byte appears as space>","<ASCII 1>","<ASCII 2>"
	
	If you compile TEST.BAS with BC.EXE, the 0, 1, and 2 byte values are
	stripped out of the quoted strings in the DATA statement, and the
	length of each Y$ input by the READ statement will display as zero. If
	you load TEST.BAS into QB.EXE or QBX.EXE, the DATA statement will be
	truncated at the null (0) byte, thus ignoring the remaining data on
	that line, giving you an "Out of Data" error at run time.
	
	Workaround Code Example
	-----------------------
	
	The DATA statement in the following program works correctly in all
	versions of compiled BASIC mentioned in this article:
	
	   CLS
	   ' ASCII 0 is null byte (displays nothing), ASCII 1 is happy face,
	   ' ASCII 2 is inverse video happy face, ASCII 3 is filled heart
	   FOR j = 1 TO 4
	   READ X
	   PRINT X; CHR$(X) ' Displays correctly.
	   NEXT
	   DATA 0,1,2,3
