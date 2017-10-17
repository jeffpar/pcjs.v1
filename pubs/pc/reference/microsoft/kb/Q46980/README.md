---
layout: page
title: "Q46980: CALL INTERRUPT Example to Get Disk Drive Capacity &amp; Free Space"
permalink: /pubs/pc/reference/microsoft/kb/Q46980/
---

## Q46980: CALL INTERRUPT Example to Get Disk Drive Capacity &amp; Free Space

	Article: Q46980
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890705-65 B_BasicCom
	Last Modified: 20-DEC-1989
	
	A compiled BASIC program can retrieve a disk drive's free space by
	using an MS-DOS interrupt. The interrupt 21 Hex, with subfunction 36
	Hex, allows a program to obtain a drive's allocation information,
	which provides the drive size and available space. The sizes are
	returned in clusters and must be converted to bytes.
	
	This method is faster than using BASIC's SHELL statement to execute
	the MS-DOS CHKDSK (check disk) command.
	
	The code sample below shows how to use the CALL INTERRUPT routine to
	display a drive's used space, available space, and total capacity. The
	example works under MS-DOS in Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00 for MS-DOS. For QuickBASIC 2.00,
	2.01, or 3.00, you need to modify the program to use the CALL INT86
	statement instead of CALL INTERRUPT.
	
	Below is further information about MS-DOS interrupt 21 Hex (33
	decimal), with subfunction 36 Hex (54 decimal). This subfunction gets
	disk-drive allocation information, from which the drive's capacity and
	remaining free space can be calculated.
	
	Invoke this function with the following register values:
	
	   AH = 54
	   DL = drive code (0 = default, 1 = A, 26 = Z)
	
	If the function is successful, it returns the following:
	
	   AX = Sectors per cluster
	   BX = Number of available clusters
	   CX = Bytes per sector
	   DX = Clusters per drive
	
	If the function is unsuccessful (drive invalid), it returns the
	following:
	
	   AX = FFFF Hex
	
	Code Sample
	-----------
	
	You can compile this program within the QuickBASIC environment as
	follows:
	
	   QB filename /L [ QB.QLB ]
	
	For BASIC PDS 7.00, start the QBX.EXE environment as follows:
	
	   QBX filename /L [ QBX.QLB]
	
	Or, compile with BC.EXE and LINK.EXE as follows:
	
	   BC filename [ options ]
	   LINK filename,,,QB.LIB [ options ]
	
	For BASIC PDS 7.00, use BC.EXE and LINK.EXE as follows:
	
	   BC filename [ options ]
	   LINK filename,,,QBX.LIB [ options ]
	
	REM ******************************************************************
	REM **                                                              **
	REM ** RegType is a user-defined type used by the CALL INTERRUPT    **
	REM ** routine. The file QB.BI contains the user-defined type and   **
	REM ** the prototyping for the subprogram INTERRUPT. The            **
	REM ** INTERRUPT routine is located in the QB.QLB and the QB.LIB.   **
	REM **                                                              **
	REM ** For BASIC PDS 7.00 use QBX.BI for the include file and the   **
	REM ** library QBX.QLB or QBX.LIB for CALL INTERRUPT support.       **
	REM **                                                              **
	REM ** NOTE: When not using the user-defined type provided with     **
	REM **       the QuickBASIC package, the length of the TYPE must    **
	REM **       be 20 bytes long. Unpredictable results will occur     **
	REM **       if the length is less than 20 bytes.                   **
	REM **                                                              **
	REM ******************************************************************
	
	TYPE RegType
	  AX    AS INTEGER
	  BX    AS INTEGER
	  CX    AS INTEGER
	  DX    AS INTEGER
	  BP    AS INTEGER
	  SI    AS INTEGER
	  DI    AS INTEGER
	  FLAGS AS INTEGER
	  DS    AS INTEGER
	  ES    AS INTEGER
	END TYPE
	DIM REGS AS RegType
	CLS
	PRINT "**  Drive Capacity Utility  **" : PRINT
	PRINT "NOTE: Drive number ranges 0 through 26, where A = 1, C = 3"
	PRINT
	INPUT "Drive number to obtain drive capacity from : ", DriveNum%
	IF DriveNum% < 0 OR DriveNum% > 26 THEN
	   PRINT
	   PRINT "ERROR: Invalid Drive Number (RANGE: 0 thru 26)"
	   PRINT
	   END
	END IF
	REGS.AX = &H3600      '** AH = 36, AL = 00
	REGS.DX = DriveNum%   '** DH = ??, DL = DriveNum%
	CALL INTERRUPT(&H21, REGS, REGS)
	IF REGS.AX = -1 THEN    '** -1 = &HFFFF
	   PRINT
	   PRINT "ERROR: Invalid Drive Specification"
	   PRINT
	   END
	END IF
	
	REM ** TEMP = [ Sectors per cluster ] TIMES [ Bytes per Sector ]    **
	Temp& = REGS.AX * REGS.CX
	
	REM ** CAPACITY  = [ TEMP ] TIMES [ Clusters per Drive ]            **
	Capacity& = Temp& * REGS.DX
	
	REM ** AVAILABLE = [ TEMP ] TIMES [ Number of Available Clusters ]  **
	Available& = Temp& * REGS.BX
	
	REM ** INUSE     = [ CAPACITY ] TIMES [ AVAILABLE ]                 **
	InUse& = Capacity& - Available&
	
	PRINT
	PRINT "Drive Number = "; DriveNum%
	IF DriveNum% = 0 THEN
	   PRINT "** Default drive number used **"
	ELSE
	   PRINT "      Letter =  "; CHR$(64 + DriveNum%)
	END IF
	PRINT
	PRINT USING "Capacity  = ###,###,###"; Capacity&
	PRINT USING "In Use    = ###,###,###"; InUse&
	PRINT "            ==========="
	PRINT USING "Available = ###,###,###"; Available&
	END
