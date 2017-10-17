---
layout: page
title: "Q38492: FILEATTR Gets MS-DOS File Handle to Get File Date/Time Stamp"
permalink: /pubs/pc/reference/microsoft/kb/Q38492/
---

## Q38492: FILEATTR Gets MS-DOS File Handle to Get File Date/Time Stamp

	Article: Q38492
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-MAR-1990
	
	When you open a file with the OPEN statement in a compiled BASIC
	program, the file number that you give is not the MS-DOS file handle.
	Instead, the file number acts as a pointer into an internal table that
	BASIC uses to hold the file handles. You can use the FILEATTR function
	to obtain the actual MS-DOS file handle.
	
	The syntax for getting the file handle is as follows:
	
	   FILEATTR(filenumber, 2)
	
	The program example below shows how to obtain the MS-DOS file handle
	of a file using the FILEATTR function. The program then uses the file
	handle in an MS-DOS INTERRUPT call to return the file's date and time
	stamp.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	The FILEATTR function is not available with QuickBASIC versions
	earlier than Version 4.00.
	
	This code example invokes MS-DOS interrupt 21 hex (33 decimal) with
	function 57 hex (87 decimal) to get a file's date and time stamp from
	the file's directory entry. This interrupt requires an MS-DOS file
	handle as an argument. BASIC's FILEATTR function is used to retrieve
	the file handle before invoking the interrupt.
	
	Code Example
	------------
	
	DEFINT A-Z
	REM $INCLUDE: 'qb.bi'
	REM  In BASIC PDS 7.00 you must instead include 'qbx.bi'
	REM  In QB.EXE, use QB /L QB.QLB. In QBX.EXE, use QB /L QBX.QLB.
	REM  In BC.EXE for QuickBASIC 4.00, 4.00b, 4.50, or BASIC Compiler
	REM  6.00, 6.00B, link with QB.LIB. In BC.EXE for BASIC PDS 7.00,
	REM  link with QBX.LIB. (To support the CALL INTERRUPT statement.)
	
	DIM inregs AS RegType, outregs AS RegType
	ON ERROR GOTO ErrorHandler
	CLS
	INPUT "Enter filename:", filename$
	
	OPEN filename$ FOR INPUT AS #1
	filename$ = filename$ + CHR$(0)  ' ASCIIZ (Null on end)
	inregs.ax = &H5700
	inregs.bx = FILEATTR(1, 2)       ' Get DOS File Handle
	CALL INTERRUPT(&H21, inregs, outregs)
	
	REM Date is returned in outregs.dx.
	REM   Day   : Bits 0-4
	REM   Month : Bits 5-8
	REM   Year  : Bits 9-15 (from 1980)
	Day = outregs.dx AND 31                ' Mask the upper bits
	Month = (outregs.dx \ 2 ^ 5) AND 15    ' Shift L 5 & mask upper bits
	Year = 1980 + (outregs.dx \ 2 ^ 9)     ' Shift left 9 & add 1980
	PRINT "Month ="; Month; "  Day ="; Day; "  Year ="; Year
	
	REM Time is returned in outregs.cx
	REM   Seconds : Bits 0-4 (2 second increments)
	REM   Minutes : Bits 5-10
	REM   Hours   : Bits 11-15
	seconds = 2 * (outregs.cx AND 31) '  Mask the upper bits & mult. by 2
	minutes = (outregs.cx \ 2 ^ 5) AND 63  ' Shift L 5 & mask upper bits
	hours = outregs.cx     ' Shift left 11 - Be sure to shift in zeros!
	hours = hours \ 2
	hours = hours AND 32767
	hours = hours \ 2 ^ 10
	PRINT "Sec ="; seconds; "  Min ="; minutes; "  Hours ="; hours
	SHELL "dir " + filename$
	CLOSE #1
	END
	
	ErrorHandler:
	        IF ERR = 53 THEN    ' File Not Found
	          PRINT "Incorrect path or File does not exist"
	        ELSE
	          PRINT ERR
	        END IF
	        END
