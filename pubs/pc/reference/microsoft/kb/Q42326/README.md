---
layout: page
title: "Q42326: Wrong Example in QB Advisor for CALL INTERRUPT"
permalink: /pubs/pc/reference/microsoft/kb/Q42326/
---

## Q42326: Wrong Example in QB Advisor for CALL INTERRUPT

	Article: Q42326
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890220-8 docerr
	Last Modified: 12-NOV-1990
	
	The code example for CALL INTERRUPT in the QuickBASIC version 4.50 QB
	Advisor hypertext online Help system is the wrong example because it
	is actually a code example for CALL INT86OLD, and the CALL INTERRUPT
	example is missing. In addition, two errors need correcting in this
	CALL INT86OLD example. Working examples of CALL INT86OLD (corrected)
	and CALL INTERRUPT are shown below.
	
	The following two errors need to be corrected in the CALL INT86OLD
	example that comes up on the QuickBASIC 4.50 QB Advisor "Help: Call
	Interrupt Statement Programming Example":
	
	1. The following incorrect line
	
	      $INCLUDE: 'QB.BI'    [Gives "Expected: Statement" error in QB.EXE.]
	
	   should be corrected to read as follows:
	
	      REM $INCLUDE: 'QB.BI'
	
	2. The following incorrect line
	
	      INARY%(DX) = SADD("FOO.TXT" + CHR$(0))  ["Expected: Variable" error.]
	
	   should be changed into the following two lines:
	
	      a$ = "FOO.TXT" + CHR$(0)
	      INARY%(DX) = SADD(a$)
	
	The corrected CALL INT86OLD example is shown in Example 1 below.
	
	The CALL INTERRUPT statement is shown in Example 2 below. A code
	example for CALL INTERRUPT can also be found on Pages 74-76 of
	"Microsoft QuickBASIC 4.5: BASIC Language Reference," which is sold
	separately (see the order card in the 4.50 package).
	
	In the QBX.EXE Microsoft Advisor online Help system (for Microsoft
	BASIC PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2), the CALL
	INTERRUPT code example correctly displays on the "Help: Interrupt,
	Interruptx Routines Programming Example" screen (and the example works
	correctly).
	
	Note that the INT86OLD and INT86XOLD routines are not documented in
	any printed or online documentation in BASIC PDS 7.00 and 7.10, as
	explained in a separate article found by querying with the following
	words:
	
	   INT86OLD and help and docerr
	
	Example 1: CALL INT86OLD Example (Corrected)
	--------------------------------------------
	
	' Note:  To use CALL INTERRUPT, you must load the Quick library QB.LIB
	'        with QuickBASIC. The program also uses the QB.BI header file.
	
	' Include header file for INT86OLD, etc.
	REM $INCLUDE: 'QB.BI'  ' Added REM to correct "Expected: Statement" error
	
	DIM INARY%(7), OUTARY%(7)         'Define input and output
	                  'arrays for INT86.
	'
	' Define register-array indices to
	' make program easier to understand.
	CONST AX = 0, BX = 1, CX = 2, DX = 3, bp = 4, si = 5, di = 6, FL = 7
	'
	INARY%(AX) = &H3C00               'DOS function to create a file.
	INARY%(CX) = 0                    'DOS attribute for created file.
	a$ = "FOO.TXT" + CHR$(0)   ' Added this line and modified next line to
	INARY%(DX) = SADD(a$)      ' correct "Expected: Variable" error.
	                  'Pointer to file-name string
	                  'with zero byte termination.
	
	CALL INT86OLD(&H21, INARY%(), OUTARY%())
	                  'Perform the creation.
	'
	INARY%(BX) = OUTARY%(AX)          'Move created file handle for write.
	INARY%(AX) = &H4000               'DOS function to write to file.
	TEXT$ = "hello, world" + CHR$(13) + CHR$(10)
	                  'Define text to write to file.
	INARY%(CX) = LEN(TEXT$)           'Get length of text string.
	INARY%(DX) = SADD(TEXT$)          'Get address of text string.
	CALL INT86OLD(&H21, INARY%(), OUTARY%())
	                  'Perform the write.
	'
	INARY%(AX) = &H3E00               'DOS function to close a file.
	CALL INT86OLD(&H21, INARY%(), OUTARY%())
	                  'Perform the close.
	
	Example 2: CALL INTERRUPT Example (not found in QB Advisor 4.50 Help)
	---------------------------------------------------------------------
	
	'This example uses the Interrupt routine to determine the current
	'drive and the amount of free space remaining on the drive.
	
	'Note: To use the Interrupt routine, you must load the Quick library
	'QB.QLB using the /L switch when you begin QB. The following include
	'file must also be present.
	
	'$INCLUDE: 'QB.BI'
	
	'Define registers.
	DIM regs AS RegType
	
	'Get current drive info; set up input and do system call.
	regs.ax = &H1900
	CALL INTERRUPT(&H21, regs, regs)
	
	'Convert drive info to readable form.
	Drive$ = CHR$((regs.ax AND &HFF) + 65) + ":"
	
	'Get disk free space; set up input values and do system call.
	regs.ax = &H3600
	regs.dx = ASC(UCASE$(Drive$)) - 64
	CALL INTERRUPT(&H21, regs, regs)
	
	'Decipher the results.
	SectorsInCluster = regs.ax
	BytesInSector = regs.cx
	IF regs.dx >= 0 THEN
	    ClustersInDrive = regs.dx
	ELSE
	    ClustersInDrive = regs.dx + 65536
	END IF
	IF regs.bx >= 0 THEN
	    ClustersAvailable = regs.bx
	ELSE
	    ClustersAvailable = regx.bx + 65536
	END IF
	Freespace = ClustersAvailable * SectorsInCluster * BytesInSector
	
	'Report results.
	CLS
	PRINT "Drive "; Drive$; " has a total of";
	PRINT USING "###,###,###"; Freespace;
	PRINT " bytes remaining free."
