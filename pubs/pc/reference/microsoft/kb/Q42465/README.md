---
layout: page
title: "Q42465: CALL ABSOLUTE Hang; Assembly Must Use CB Return Instruction"
permalink: /pubs/pc/reference/microsoft/kb/Q42465/
---

## Q42465: CALL ABSOLUTE Hang; Assembly Must Use CB Return Instruction

	Article: Q42465
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890222-47 B_BasicCom
	Last Modified: 12-DEC-1989
	
	An assembly-language routine accessed with CALL ABSOLUTE must use a
	machine-language return instruction of CB hex (a far return), instead
	of C3 hex (a near return).
	
	The two programs shown below demonstrate that a program hangs if it
	uses CALL ABSOLUTE on an assembly-language routine that returns with a
	return instruction of C3 (Hex). To correct this problem, you must use
	a return instruction of CB (hex).
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The far-return instruction CB (hex) correctly pops 4 bytes off the
	stack for a segment and offset to return. Near-return C3 (hex) pops
	only 2 bytes off the stack for an offset, which is inappropriate.
	
	The following is a good reference for the machine instructions in the
	Intel 8086 family of microprocessors: "The 80386 Book: Assembly
	Language Programmer's Guide for the 80386," by Ross Nelson (published
	by Microsoft Press, 1988).
	
	The following program is TEST1.BAS. It calls an assembly-language
	routine that prints an "A" on the screen. It uses the correct return
	code of CB.
	
	DIM ASMROUTINE(1 TO 6) AS INTEGER
	DATA &H55       : ' PUSH BP       Save base pointer
	DATA &H8B,&HEC  : ' MOV BP,SP     Get our own
	DATA &HB4,2     : ' MOV AH,2      Function 2 - print to screen
	DATA &HB2,65    : ' MOV DL,65     Character 'A'
	DATA &HCD,&H21  : ' INT 21H       Make ROM BIOS call
	DATA &H5D       : ' POP BP        Restore base pointer
	DATA &HCB,0     : ' RET           Far Return (correct)     <-----
	OFFSET = VARPTR(ASMROUTINE(1))
	DEF SEG = VARSEG(ASMROUTINE(1))
	' Poke assembly routine into memory:
	FOR I = 0 TO 11
	     READ ASMCODE
	     POKE (OFFSET + I), ASMCODE
	NEXT I
	CALL ABSOLUTE(VARPTR(ASMROUTINE(1)))     ' call routine we poked in
	DEF SEG
	END
	
	The following program, TESTS.BAS, uses the incorrect return code and
	hangs the machine:
	
	DIM ASMROUTINE(1 TO 6) AS INTEGER
	DATA &H55           : ' PUSH BP      Save base pointer
	DATA &H8B,&HEC      : ' MOV BP,SP    Get our own
	DATA &HB4,2         : ' MOV AH,2     Function 2 - print to screen
	DATA &HB2,65        : ' MOV DL,65    Character 'A'
	DATA &HCD,&H21      : ' INT 21H      Make ROM-BIOS call
	DATA &H5D           : ' POP BP       Restore base pointer
	DATA &HC3,0         : ' RET          Near Return (incorrect)  <-----
	OFFSET = VARPTR(ASMROUTINE(1))
	DEF SEG = VARSEG(ASMROUTINE(1))
	' Poke assembly routine into memory:
	FOR I = 0 TO 11
	     READ ASMCODE
	     POKE (OFFSET + I), ASMCODE
	NEXT I
	CALL ABSOLUTE(VARPTR(ASMROUTINE(1)))      ' call routine we poked in
	DEF SEG
	END
