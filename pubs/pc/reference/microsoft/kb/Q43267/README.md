---
layout: page
title: "Q43267: How to Flush File Buffers from within a BASIC Program"
permalink: /pubs/pc/reference/microsoft/kb/Q43267/
---

## Q43267: How to Flush File Buffers from within a BASIC Program

	Article: Q43267
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890403-182 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00.
	
	Flushing a file buffer to disk from within a BASIC program can be done
	with one of the following two methods using MS-DOS Interrupt CALLs:
	
	1. Using MS-DOS Version 3.30 or later, the MS-DOS Interrupt 21 Hex
	   with Function 68 Hex commits the file buffer to disk.
	
	2. Using MS-DOS earlier than Version 3.30, the MS-DOS Interrupt 21 Hex
	   with Function 45 Hex creates a duplicate file handle, followed by a
	   Interrupt 21 Hex with Function 3E Hex to close the duplicate file
	   handle, which commits the file buffer to disk.
	
	Using Interrupt 21 Hex with Function 68 Hex has the advantage of not
	failing due to an insufficient number of file handles, or not risking
	losing control of the file in network environments. Its disadvantage
	is its limitation to MS-DOS 3.30 or later.
	
	Code Example
	------------
	
	DECLARE SUB commit (filenum%)     'for use with DOS 2.10 & up
	DECLARE SUB commit330 (filenum%)  'for use with DOS 3.30 & up
	
	'The INCLUDE file name below would be 'QBX.BI' in the BASIC PDS 7.00
	'$INCLUDE: 'QB.BI'                'include file with regtype structure
	
	CLS
	DIM SHARED inregs AS RegType      'define inregs of regtype
	DIM SHARED outregs  AS RegType    'define outregs of regtype
	
	'-----------------------------------------------------------
	PRINT "press any key to open file"
	SLEEP                             'wait for keyboard input
	OPEN "b:stuff2" FOR RANDOM AS #1 LEN = 80
	PRINT "press a key to write to buffer"
	SLEEP
	a$ = "this and that"
	PUT #1, 1, a$                     'Write buffer
	
	'-----------------------------------------------------------
	PRINT "press any key to commit the buffer to disk"
	SLEEP                             'wait for keyboard input
	CALL commit330(1)                 'commit buffer for file 1
	
	'-----------------------------------------------------------
	PRINT "press any key to close file"
	SLEEP
	CLOSE 1
	END
	
	SUB commit (filenum%)
	inregs.ax = &H4500                'set funct 45H duplicate handle
	inregs.bx = FILEATTR(filenum%, 2) 'set file handle to duplicate
	CALL interrupt(&H21, inregs, outregs)  'call int 21H function 45H
	inregs.ax = &H3E00                'set function 3EH close file
	inregs.bx = outregs.ax            'set duplicated handle to close
	CALL interrupt(&H21, inregs, outregs) 'call int 21H function 3EH
	END SUB
	
	SUB commit330 (filenum%)
	inregs.ax = &H6800                'function 68h
	inregs.bx = FILEATTR(filenum%, 2) 'place file handle in register BX
	inregs.flags = &H0                'initialize flag values
	CALL interrupt(&H21, inregs, outregs)  'call interrupt 21 to
	'                                       commit buffer
	END SUB
