---
layout: page
title: "Q28044: BC.EXE Cannot Compile ASCII 1 or 2 in Fast Load Format Files"
permalink: /pubs/pc/reference/microsoft/kb/Q28044/
---

## Q28044: BC.EXE Cannot Compile ASCII 1 or 2 in Fast Load Format Files

	Article: Q28044
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	Files saved in the QuickBASIC Fast Load format that contain an ASCII 1
	or 2 byte value (control code) typed into a comment or quoted string
	constant (such as using CTRL+P+A for ASCII 1 or CTRL+P+B for ASCII 2
	in QB.EXE or QBX.EXE) cannot be compiled with BC.EXE. BC.EXE gives a
	"Statement Unrecognizable" error at compile time. (The ASCII 1 or 2
	control characters compile correctly with BC.EXE when saved in Text
	format. Other control character bytes compile successfully with BC.EXE
	when saved with Fast Load or Text format.)
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b); and
	in Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	In BC.EXE version 4.50 and in Microsoft BASIC PDS versions 7.00 and
	7.10 for MS-DOS and MS OS/2, you do not get a compile-time error (for
	the Fast Load format file), but the BC.EXE compiler strips the ASCII 1
	or 2 byte out of quoted strings, and the byte is not printed on the
	screen at run time. To work around this problem, you can use the CHR$
	function, as follows:
	
	   CHR$(1)
	or
	   CHR$(2)
	
	Press CTRL+P followed by a control character to type control
	characters into the QB.EXE or QBX.EXE editor.
	
	Related Note: The following limitation is by design, and distinct from
	the above software problem. ASCII byte values 1 (CTRL+P+A), 2
	(CTRL+P+B), and 3 (CTRL+P+C) can be placed in DATA statements, but
	your variable in the READ statement must be a string variable (such as
	X$) to receive the control character byte. Incorrectly using a numeric
	variable in the READ statement to receive these characters will give
	"Out of Data" in QB.EXE in QuickBASIC 4.00 and 4.00b, and "Syntax
	Error" in QB.EXE in QuickBASIC 4.50. Also in 4.00 and 4.00b, you get
	"Out of Data" unless you put double quotation marks around the byte
	values; in 4.50, the double quotation marks are optional around the
	byte values in the DATA statement.
	
	In contrast, when you use direct numeric constants such as 1, 2, and 3
	(DATA 1,2,3), you need to READ into a numeric variable.
	
	Example 1
	---------
	
	Compiling the following statement in BC.EXE demonstrates the problem.
	Type CTRL+P followed by CTRL+A (that is, CTRL+P+A) to put an ASCII 1
	into the quoted string in the QB.EXE editor. CTRL+P+B puts an ASCII 2
	into a quoted string in QB.EXE. The ASCII 1 appears as a happy face
	symbol, and ASCII 2 appears as an inverse-video happy face.
	
	   PRINT "< CTRL+P+A > < CTRL+P+B >"
	
	Depending upon your usage of the ASCII 1 or 2 byte, you can use any of
	the following to work around the problem:
	
	1. Use the CHR$ function as a workaround to embed ASCII 1 or 2 into a
	   string variable. For example, the following program prints happy
	   faces in both the QB.EXE editor and in an .EXE program in
	   QuickBASIC versions 4.00, 4.00b, 4.50, BASIC compiler 6.00 and
	   6.00b, and BASIC PDS version 7.00:
	
	      HAPPY$=CHR$(1)+CHR$(2)
	      PRINT HAPPY$ + " TEST " + HAPPY$
	
	2. The ASCII 1 or 2 bytes can be successfully embedded in quoted
	   strings or remarks if you run in the QB.EXE version 4.00, 4.00b, or
	   4.50 editor, or the QBX.EXE editor supplied with BASIC PDS version
	   7.00.
	
	3. If the file is saved as Text instead of in Fast Load format, it
	   compiles without error in BC.EXE in QuickBASIC 4.00, 4.00b, or
	   4.50. This corrects the problem if you are just using ASCII 1 or 2
	   in remarks (REM or ' statements) in the source code. However, the
	   ASCII 1 or 2 character will be stripped from any quoted strings in
	   your program if you run from an .EXE program.
	
	4. In QuickBASIC version 4.50 and BASIC PDS version 7.00, BC.EXE
	   compiles the program correctly regardless of Fast Load format. This
	   corrects the problem if you are just using ASCII 1 or 2 in remarks
	   (REM or ' statements) in the source code. However, the ASCII 1 or 2
	   character will still be stripped from any quoted strings in your
	   program if you run from an .EXE program.
	
	Example 2
	---------
	
	The following program is another demonstration of the problem. Type
	this program in the QB.EXE or QBX.EXE editor, and choose the Make EXE
	File command on the Run menu.
	
	   ' In QB.EXE and QBX.EXE, CTRL+P can be used to embed control
	   '   characters:
	   A$ = "Press: CTRL+P+A" + "Press: CTRL+P+B"
	   PRINT A$
	   OPEN "JUNK.TST" FOR OUTPUT AS #1
	   PRINT#1,A$
	   CLOSE
	
	Running the .EXE version of this program shows that the ASCII 1 and 2
	happy face characters do not display on the screen or write to the
	file because they were stripped out at compile time. After running
	this program, perform the following command in DOS to display the
	characters written to the file:
	
	   TYPE JUNK.TST
	
	A simple workaround is to replace the first line of the program with
	the following:
	
	   A$ = CHR$(1) + CHR$(2)
