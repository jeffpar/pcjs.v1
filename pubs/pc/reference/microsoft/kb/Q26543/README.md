---
layout: page
title: "Q26543: Hardware Errors During CALL INTERRUPT Hang the System"
permalink: /pubs/pc/reference/microsoft/kb/Q26543/
---

## Q26543: Hardware Errors During CALL INTERRUPT Hang the System

	Article: Q26543
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 31-JAN-1990
	
	DOS interrupt calls that result in a hardware error, such as an open
	disk-drive door or a bad sector, cause the system to hang.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS OS/2. This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	When you are inside the editor and using the DOS interrupt procedures
	(INT86OLD, INTERRUPT) to open a data file that is on a floppy disk, if
	the disk-drive door is left open, the error is caught and handled by
	the editor. However, if the program is made into an executable, when
	the door is left open, the error is not trapped and control is never
	returned to the BASIC program. This effectively hangs the system.
	
	To work around the problem, OPEN a file for input on the floppy disk
	and trap potential disk errors with ON ERROR GOTO before attempting to
	CALL INTERRUPT.
	
	Results of testing with earlier versions show that the errors are
	trapped correctly with QuickBASIC Version 3.00; therefore, the problem
	does not occur in Version 3.00.
	
	The following is example code:
	
	TYPE RegType
	     ax    AS INTEGER
	     bx    AS INTEGER
	     cx    AS INTEGER
	     dx    AS INTEGER
	     bp    AS INTEGER
	     si    AS INTEGER
	     di    AS INTEGER
	     flags AS INTEGER
	END TYPE
	
	DECLARE SUB INTERRUPT (intnum AS INTEGER, inreg AS RegType, outreg AS RegType
	
	DIM inarray AS RegType, outarray AS RegType
	
	file$ = "a:dummy.dat" + CHR$(0)
	
	inarray.ax = &H3D02
	inarray.dx = SADD(file$)
	
	CALL INTERRUPT(&H21, inarray, outarray)
	PRINT outarray.flags
	PRINT outarray.ax
	END
