---
layout: page
title: "Q61678: Routine to Save and Restore a Block of Memory to a File"
permalink: /pubs/pc/reference/microsoft/kb/Q61678/
---

## Q61678: Routine to Save and Restore a Block of Memory to a File

	Article: Q61678
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900426-43 B_BasicCom
	Last Modified: 10-MAY-1990
	
	The program shown below allows a block of memory to be saved and
	restored to any location in a file. This program uses DOS interrupts
	to save and restore an area of memory to/from a file.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS.
	
	This routine can be used for several purposes:
	
	1. This routine can be used for saving and restoring an array quickly
	   to a file. BASIC PDS 7.00 can do this by using STATIC arrays in a
	   user-defined type, but earlier versions of BASIC don't have this
	   ability.
	
	      Note: Variable-length string arrays cannot use this method, as
	      the string data is not contiguous in memory.
	
	2. This routine can be used in place of BLOAD and BSAVE to save and
	   restore graphic screen images. The advantages of this routine are
	   that in EGA and VGA screen modes, all of the screen planes can be
	   stored to one file as opposed to four separate files.
	
	3. This routine can be used when debugging a program to dump an area
	   of memory to a file for later viewing by a hex dump program.
	
	The program shown below, BUFTEST.BAS, must have the support routines
	for CALL INTERRUPT. To load the Quick library QB.QLB, start QuickBASIC
	with the following line:
	
	   QB /l
	
	To load the Quick library QBX.QLB, start the QuickBASIC Extended
	(QBX.EXE) environment with the following line:
	
	   QBX /l
	
	The following program is BUFTEST.BAS and demonstrates quickly saving
	and restoring an integer array to a file:
	
	DECLARE SUB ReadBuffer (FileName$, FileLocation&, NumBytes%,_
	                        Segment%, Offset%)
	DECLARE SUB WriteBuffer (FileName$, FileLocation&, NumBytes%,_
	                         Segment%, Offset%)
	' Switch the following two lines for BASIC PDS 7.00
	' REM $INCLUDE: 'qbx.bi'
	REM $INCLUDE: 'qb.bi'
	
	' These two dimension lines need to be in the program for the
	' Buffer subprograms. They must be dimensioned here because
	' if they are dynamically created in the subprogram it could cause
	' arrays and variables to move, thus invalidating the addresses
	' passed to the subroutines.
	DIM SHARED InRegsx AS regtypex, OutRegsx AS regtypex
	DIM SHARED Filenum AS INTEGER, FileHandle AS INTEGER
	
	' Dimension the test array to save and restore from the file
	DIM a(1 TO 100) AS INTEGER
	
	CLS
	
	' Create and initialize an array
	FOR x% = 1 TO 10
	   a(x%) = x%
	NEXT
	
	' Write the array to the file
	CALL WriteBuffer("Test.DAT", 10, 20, VARSEG(a(1)), VARPTR(a(1)))
	
	' Clear the array and display that it is zeroed
	ERASE a
	FOR x% = 1 TO 10
	   PRINT a%(x%),
	NEXT
	
	' Read the array back in and display that it has been restored
	CALL ReadBuffer("Test.DAT", 10, 20, VARSEG(a(1)), VARPTR(a(1)))
	FOR x% = 1 TO 10
	   PRINT a%(x%),
	NEXT
	
	' Read information from a file into a memory address
	' The parameters are:
	'   FileName$     - Filename to write information to
	'   FileLocation& - Starting byte location in file
	'   NumBytes%     - Number of bytes to write (2 integers at 10 bytes
	'                   each)
	'   Segment%      - Segment address of memory location to save to
	'                   file
	'   Offset%       - Offset address of memory location to save to file
	SUB ReadBuffer (FileName$, FileLocation&, NumBytes%, Segment%,_
	                Offset%)
	   Filenum = FREEFILE                            ' Get next file #
	   OPEN FileName$ FOR BINARY AS #Filenum
	   FileHandle = FILEATTR(Filenum, 2)             ' Get DOS file handle
	
	   InRegsx.ax = &H4200                           ' Interrupt to SEEK
	   InRegsx.bx = FileHandle                       '  to specified byte
	   InRegsx.cx = PEEK(VARPTR(FileLocation&) + 2)  '  in file.
	   InRegsx.dx = PEEK(VARPTR(FileLocation&))
	   CALL Interruptx(&H21, InRegsx, OutRegsx)
	
	   InRegsx.ax = &H3F00                           ' Read a block of
	   InRegsx.bx = FileHandle                       '  data from the
	   InRegsx.cx = NumBytes%                        '  file into memory.
	   InRegsx.ds = Segment%
	   InRegsx.dx = Offset%
	   CALL Interruptx(&H21, InRegsx, OutRegsx)
	   CLOSE #Filenum
	END SUB
	
	' Write a block of memory to a file
	' The parameters are:
	'   FileName$     - Filename to write information to
	'   FileLocation& - Starting byte location in file
	'   NumBytes%     - Number of bytes to write (2 integers at 10 bytes
	'                   each)
	'   Segment%      - Segment address of memory location to save to
	'                   file
	'   Offset%       - Offset address of memory location to save to file
	SUB WriteBuffer (FileName$, FileLocation&, NumBytes%, Segment%,_
	                 Offset%)
	   Filenum = FREEFILE                            ' Get next file #
	   OPEN FileName$ FOR BINARY AS #Filenum
	   FileHandle = FILEATTR(Filenum, 2)             ' Get DOS file handle
	
	   InRegsx.ax = &H4200                           ' Interrupt to SEEK
	   InRegsx.bx = FileHandle                       '  to specified byte
	   InRegsx.cx = PEEK(VARPTR(FileLocation&) + 2)  '  in file.
	   InRegsx.dx = PEEK(VARPTR(FileLocation&))
	   CALL Interruptx(&H21, InRegsx, OutRegsx)
	
	   InRegsx.ax = &H4000                           ' Write a block of
	   InRegsx.bx = FileHandle                       ' memory to a file
	   InRegsx.cx = NumBytes%
	   InRegsx.ds = Segment%
	   InRegsx.dx = Offset%
	   CALL Interruptx(&H21, InRegsx, OutRegsx)
	   CLOSE #Filenum
	END SUB
