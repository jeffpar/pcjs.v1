---
layout: page
title: "Q61349: BASIC PDS 7.00 &quot;Program Memory Overflow&quot; with Too Many CONST"
permalink: /pubs/pc/reference/microsoft/kb/Q61349/
---

## Q61349: BASIC PDS 7.00 &quot;Program Memory Overflow&quot; with Too Many CONST

	Article: Q61349
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900329-74
	Last Modified: 27-JUL-1990
	
	When used with the /V switch, the BC.EXE compiler that comes with
	Microsoft BASIC Professional Development System (PDS) version 7.00
	produces a "Program memory overflow" error when compiling a program
	that has approximately 680+ CONSTants. The compiler can still have up
	to 13K "bytes free" of compiler workspace when reporting this error.
	
	"Program memory overflow" also occurs when compiling the TEST1.BAS
	program generated below using 756+ CONSTants with the BC /Fs (far
	strings) option.
	
	The CONST limits are improved in BASIC PDS version 7.10, which can
	handle significantly more CONSTants than BASIC 7.00.
	
	The error message "Program memory overflow" is misleading because
	normally the compiler only gives that error when more than 64K of code
	has been generated for the module being compiled. This error
	represents a limitation of the compiler. This error is generated when
	the number of CONSTants that can be included in a BASIC module has
	been exceeded.
	
	The "Program memory overflow" error above is due to the amount of
	internal overhead that the compiler sets aside to do its work with
	CONSTants. The error message is not generated because of a lack of
	compiler workspace. In this case, 13K "bytes free" is a valid number.
	There is actually 13K of compiler workspace free. A different
	limitation has been encountered -- the number of CONSTants BC.EXE can
	handle.
	
	The BC.EXE in QuickBASIC version 4.50 and the BC.EXE compiler in BASIC
	versions 6.00b and 7.10 will successfully compile a program with over
	1000 CONSTants.
	
	Illustration
	------------
	
	To demonstrate the limitation in 7.00, use the FIRST.BAS program below
	to create the BASIC program TEST1.BAS with "n" number of CONSTants.
	For example, a TEST1.BAS program created with approximately 650
	CONSTants will compile with no errors in BASIC PDS 7.00. A program
	with 680+ CONSTants compiled with BC /V gives "Program-memory
	overflow" in BASIC PDS 7.00.
	
	As a comparison to versions earlier than 7.00, if you create a
	TEST1.BAS program with 1000 CONSTants, it will compile correctly with
	BC.EXE 4.50 and BC.EXE 6.00b (which have a greater capacity for
	CONSTants than 7.00).
	
	As a comparison to 7.10, in TEST1.BAS created below, 7.10 can handle
	1100 CONSTants when compiled BC /V (but 1200 CONSTants gives "Program
	memory overflow"). In TEST1.BAS created below, 7.10 can handle 2100
	CONSTants when compiled BC /Fs (but 2200 CONSTants gives "Compiler out
	of memory, 0 bytes free"). BASIC 7.10 can thus handle many more
	CONSTants than 7.00.
	
	FIRST.BAS
	---------
	
	FIRST.BAS prompts you for a number, and then creates another BASIC
	program, TEST1.BAS, with that many CONSTants. Compile the resulting
	TEST1.BAS with BC /V or /Fs to test for compiler limitations.
	
	   DEFINT A-Z
	   CLS
	   INPUT "How many CONSTants to you want in the file: ", Num%
	   OPEN "test1.bas" FOR OUTPUT AS #1
	   beg$ = "CONST p"
	   equals$ = " ="
	   FOR i = 1 TO Num%
	      constant$ = beg$ + LTRIM$(RTRIM$(STR$(i))) + equals$ + STR$(i)
	      PRINT #1, constant$
	   NEXT
	   CLOSE
	   PRINT "File 'test.bas' successfully created"
	   END
