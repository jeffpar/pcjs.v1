---
layout: page
title: "Q37345: BIOS Interrupt to Read Sector, Get Disk Status, Find Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q37345/
---

## Q37345: BIOS Interrupt to Read Sector, Get Disk Status, Find Errors

	Article: Q37345
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 9-FEB-1990
	
	The BIOS interrupt call 19 decimal (13 hex), with function 2, returns
	the status of a specified disk if it is unable to read the specified
	sector. This interrupt can be used to determine if the drive door is
	open, if the disk is formatted, if the disk is write protected, and
	many other conditions. The code generated for this is smaller than a
	similar program using ON ERROR GOTO statements to trap disk errors.
	
	This information applies to QuickBASIC Versions 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50; to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (real mode only); and to Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and
	MS OS/2 (real mode only).
	
	Note that BIOS and MS-DOS interrupts are not allowed in MS OS/2
	protected mode.
	
	Interrupt 19 provides a set of functions to access the disk driver.
	Interrupt 19 with function 2 reads one or more sectors from disk into
	memory. Interrupt 19 with function 0 (reset disk system) should be
	called after a failed floppy disk Read, Write, Verify, or Format
	request before retrying the operation. For more information about this
	and other interrupts for IBM ROM BIOS and MS-DOS, see "Advanced MS-DOS
	Programming, Second Edition," by Ray Duncan (Microsoft Press, 1988).
	
	Unlike other DOS interrupt functions that access the disk drive using
	CALL INTERRUPT or CALL INTERRUPTX in QuickBASIC 4.00, 4.00b, or 4.50
	or BASIC compiler 6.00 or 6.00b, interrupt 19 with function 2 and 0
	does NOT cause a system hang if a critical error occurs (such as if a
	drive door is open or a disk is not formatted).
	
	Note: The CALL INTERRUPT or CALL INTERRUPTX statement hanging upon
	critical disk errors is a known problem with the INTERRUPT and
	INTERRUPTX routines in QuickBASIC 4.00, 4.00b, and 4.50, and Microsoft
	BASIC Compiler 6.00 and 6.00b (as reported in a separate article).
	This problem was corrected in Microsoft BASIC PDS Version 7.00.  For
	information on how to modify the INTERRUPT and INTERRUPTX routines so
	that critical errors will not hang the machine in in QuickBASIC 4.00,
	4.00b, and 4.50, and Microsoft BASIC Compiler 6.00 and 6.00b, query on
	the following keyword:
	
	   QB4CRIT
	
	The following is a QuickBASIC Versions 4.00, 4.00b, and 4.50 code
	example for calling interrupt 19 decimal (13 hex) with functions 0 and
	2:
	
	DECLARE SUB ResetDrive (drive%)
	DECLARE SUB ReadSector (drive%, sector%)
	' $INCLUDE: 'q:qb.bi'
	DIM regl AS RegTypeX, regS AS RegType
	DIM databuffer%(5120)          'room for 10 sectors of data
	sector% = 1                'sector number 1-9
	drive% = 0                 'drive A
	FOR i = 1 TO 3
	  CALL ReadSector(drive%, sector%)
	  CALL ResetDrive(drive%)
	  PRINT regl.flags, (regl.flags AND 1)
	  IF (regl.flags AND 1) = 1 THEN
	     errornum = regl.ax AND &HFF
	  ELSE
	     errornum = 0
	  END IF
	NEXT
	PRINT errornum
	END
	
	SUB ReadSector (drive%, sector%)
	SHARED databuffer%(), regl AS RegTypeX
	      intnum% = 19       'interrupt number 19 decimal (13 hex)
	      numsectors% = 1    '# read 1,8, or 9
	      track% = 0         'track#   0-39
	      head% = 0          'side 0 or 1
	      regl.ds = -1
	      regl.es = VARSEG(databuffer%(0))
	      regl.bx = VARPTR(databuffer%(0))
	      regl.cx = 256 * track% + sector%
	      regl.dx = 256 * head% + drive%
	      'AH loaded with function 2; AL loaded with number of sectors:
	      regl.ax = 2 * 256 + numsectors%  ' AX register contains AH and AL
	      CALL interruptx(intnum%, regl, regl)
	END SUB
	
	SUB ResetDrive (drive%)
	  DIM regl AS RegTypeX
	  regl.ax = 0  ' function number 0
	  regl.dx = drive%
	  CALL interruptx(&H13, regl, regl)
	END SUB
