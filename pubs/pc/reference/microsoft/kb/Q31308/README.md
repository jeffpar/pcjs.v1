---
layout: page
title: "Q31308: BASIC Example Using SETMEM to Allocate Far Heap Memory; EXEMOD"
permalink: /pubs/pc/reference/microsoft/kb/Q31308/
---

## Q31308: BASIC Example Using SETMEM to Allocate Far Heap Memory; EXEMOD

	Article: Q31308
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	To allocate a reserved location in memory that compiled BASIC will not
	touch, you can deallocate some memory by using the SETMEM function
	(see the BASIC language reference manual and the example for SETMEM
	below). Then, using either CALL INTERRUPT or CALL INT86OLD, execute a
	DOS interrupt &H21 (33), function &H48 (72). Call with AX = &H4800 and
	BX = the number of paragraphs of memory needed (the number of bytes of
	memory needed, divided by 16).
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	If the function succeeds, the flag is clear and AX returns the initial
	segment of the allocated block.
	
	If the function fails, the flag is set and AX either is 7 (if memory
	control blocks were destroyed) or 8 (if memory was insufficient, in
	which case BX gives the size of the largest available block).
	
	Please note that QuickBASIC Versions 3.00 and earlier do not have the
	SETMEM function.
	
	The following are two other methods of allocating areas of memory:
	
	1. A static array can be set aside instead as a block of memory that
	   will not move. The VARPTR function returns the offset of the array.
	
	2. The EXEMOD.EXE utility provided with the Microsoft Macro Assembler
	   allows you to modify the header of an .EXE to shorten the maximum
	   upper load address of a program. By default, BASIC .EXE programs
	   assume that all of RAM is available. If you make the load address
	   smaller, you must make sure that there is enough room for the
	   BASIC program's code and data. Microsoft does not encourage using
	   EXEMOD with compiled BASIC programs. The SETMEM function should be
	   used instead.
	
	The following is a SETMEM code example:
	
	REM $INCLUDE: 'qb.bi'
	REM For BASIC PDS 7.00 include QBX.BI
	DEFINT A-Z
	DIM InRegs AS RegType, OutRegs AS RegType
	DIM InRegsX AS RegTypeX, OutRegsX AS RegTypeX
	
	PRINT SETMEM(-1808)     'Have QuickBASIC free up some memory.
	InRegs.ax = &H4800
	InRegs.bx = 113         'Allocates a block of 113 paragraphs, or 113*16 bytes
	CALL INTERRUPT(&H21, InRegs, OutRegs)
	
	'Check results of the interrupt call.
	IF (OutRegs.flags AND 1) = 0 THEN
	     PRINT "Eureka!   Memory allocated at"; OutRegs.ax
	ELSEIF OutRegs.ax = 7 THEN
	     PRINT "ERROR!  Memory control blocks destroyed!"
	     END
	ELSE
	     PRINT "Insufficient memory!  Largest available block is: "; OutRegs.bx
	     END
	END IF
	
	'Now deallocate the memory we just allocated.
	InRegsX.es = OutRegs.ax
	InRegsX.ax = &H4900
	CALL INTERRUPTX(&H21, InRegsX, OutRegsX)
	
	'Double check the outcome of the interrupt call.
	IF (OutRegsX.flags AND 1) = 0 THEN
	     PRINT "Memory successfully deallocated."
	ELSEIF OutRegsX.ax = 7 THEN
	     PRINT "ERROR!  Memory Control Blocks destroyed!"
	ELSE
	     PRINT "ERROR!  Incorrect segment in ES!"
	END IF
