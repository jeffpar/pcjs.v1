---
layout: page
title: "Q50947: How to Get Extended Error in QuickBASIC Like EXTERR in GWBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q50947/
---

## Q50947: How to Get Extended Error in QuickBASIC Like EXTERR in GWBASIC

	Article: Q50947
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891107-92 B_BasicCom B_GWBasicI
	Last Modified: 14-DEC-1989
	
	The EXTERR function found in GW-BASIC Versions 3.20, 3.22, and 3.23 is
	not built into QuickBASIC Versions 4.00, 4,00b, 4.50, or earlier, but
	below is a code example calling a DOS interrupt that returns the same
	information (concerning extended errors in MS-DOS 3.00 and later).
	
	This code example applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00,
	and 6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS.
	
	The EXTERR function found in GW-BASIC takes a value of n as an
	argument and returns a different set of values, depending on the value
	of n. This return value gives detailed information on the most recent
	DOS error. For all values of n, EXTERR returns 0 (zero) if there was
	no previous DOS error, or if the version of DOS is earlier than 3.00.
	
	   Value of n        EXTERR(n) Return Value
	   ----------        ----------------------
	   0                 Extended error code
	   1                 Extended error class
	   2                 Extended error suggested action
	   3                 Extended error locus
	
	To find what the error codes returned by EXTERR mean, look up the
	values in "Advanced MS-DOS Programming, 2nd Edition" by Ray Duncan
	(published by Microsoft Press, 1988) on Pages 145 and 146. This book
	also documents the interrupt used below, along with the extended error
	codes on Pages 453 through 456.
	
	Compile and link with Microsoft QuickBASIC 4.00, 4.00b. and 4.50, or
	with Microsoft BASIC Compiler 6.00 and 6.00b as follows:
	
	   BC Test.bas;
	   LINK Test.bas,,,BRUNxx.Lib+QB.Lib;
	
	The "xx" in the library name is for the current version of the product
	you are using (40, 41, 45, 60, or 61). For BASIC compiler 6.00 and
	6.00b, use BRUNxxER.LIB (emulation math package) or BRUNxxAR.LIB
	(alternate math package). For the alternate math library, you must
	compile with the BC /FPa switch. If you compile with BC /O, link with
	BCOMxx.LIB instead of BRUNxx.LIB.
	
	Also, if you run this program in the QB.EXE environment, you must load
	the Quick library QB.QLB as follows:
	
	   QB /L QB.QLB
	
	For BASIC PDS 7.00, compile and link as follows:
	
	   BC Test.bas;
	   LINK Test.bas,,,BRT70ENR.Lib+QBX.Lib;
	
	The above example is for the math emulation, near strings, and real
	mode run-time library. The other posible run-time libraries and their
	corresponding compiler switches are as follows:
	
	Library Name   Compiler Switches     Comments
	------------   -----------------     --------
	
	BRT70ENR.LIB                         Emulation math, near strings
	BRT70ANR.LIB        /FPa             Alternate math, near strings
	BRT70EFR.LIB        /Fs              Emulation math, far strings
	BRT70AFR.LIB        /FPa /Fs         Alternate math, far strings
	
	To use stand-alone libraries, use BCL70xxx.LIB instead of
	BRT70xxx.LIB, and you must add the compiler switch BC /O.
	
	For the QBX.EXE 7.00 environment, use QBX.QLB as follows:
	
	   QBX /L QBX.QLB
	
	Code Example
	------------
	
	REM $INCLUDE: 'QB.BI'
	' For BC.EXE and QBX.EXE in BASIC 7.00, use the include file 'QBX.BI'
	
	DIM Inregs AS RegTypeX, Outregs AS RegTypeX
	CLS
	INPUT "Enter the filename "; test$
	test$ = test$ + CHR$(0)
	Inregs.ax = &H3D00
	Inregs.ds = VARSEG(test$)
	' For BASIC Compiler 7.00 and QBX.EXE use SSEG(test$)
	'     instead of VARSEG(test$)
	
	Inregs.dx = SADD(test$)
	CALL INTERRUPTX(&H21, inregs, outregs)
	check = outregs.flags AND &H1
	IF check = 1 THEN
	   PRINT "The file was not found"
	   Inregs.ax = &H5900
	   Inregs.bx = inregs.bx AND &HFF
	   CALL INTERRUPTX(&H21, Inregs, Outregs)
	   PRINT "This is the error number"; Outregs.ax
	ELSE
	  PRINT "Your file was found, no extended error information is needed"
	END IF
	END
