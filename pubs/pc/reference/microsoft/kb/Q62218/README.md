---
layout: page
title: "Q62218: OS/2 API Function to Get Current Drive"
permalink: /pubs/pc/reference/microsoft/kb/Q62218/
---

## Q62218: OS/2 API Function to Get Current Drive

	Article: Q62218
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S900517-70
	Last Modified: 7-JUN-1990
	
	Microsoft BASIC Compiler versions 6.00 and 6.00b and Microsoft BASIC
	Professional Development System (PDS) version 7.00 protected mode
	programs can call the OS/2 API function DosQCurDisk() to get the
	currently selected drive. DosQCurDisk() requires the following
	parameters:
	
	   Parameter   Description
	   ---------   -----------
	
	   PTR WORD    Receives current drive code (1 = A, 2 = B, etc.)
	
	   PTR DWORD   Receives logical drive bitmap (logical drives A-Z
	               correspond to bits 0-25; a bit is set if a
	               logical drive exists)
	
	The second parameter is not important in getting the current drive,
	but it is worthy to note that for API functions a DWORD (4 bytes) has
	a BASIC type of LONG. Likewise, a WORD (2 bytes) has a BASIC type of
	INTEGER. Since the specification requires pointers to these data
	items, the DECLARE statement for DosQCurDisk() uses the SEG keyword for
	each of the parameters. This causes 4-byte addresses of the parameters
	to be passed instead of 2-byte addresses, which is the default because
	BASIC uses the medium-memory model. Also, API functions return an
	error code; therefore, for BASIC to retrieve this code, it must
	declare DosQCurDisk() as a FUNCTION.
	
	The DECLARE statements for almost every API function are located in
	include files that come with BASIC 6.00 and 6.00b and BASIC PDS 7.00.
	To modify the DECLARE statement, you just have to include the right
	file. See the PACKING.LST file included with the product for a
	description of these include files.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and Microsoft BASIC PDS version 7.00 for MS OS/2.
	
	For more information on calling OS/2 API functions from Microsoft
	BASIC Compiler versions 6.00 and 6.00b, see Page 21 of the "Microsoft
	BASIC Compiler 6.0: User's Guide" included with the product.
	
	For more information on calling OS/2 API functions from BASIC PDS
	version 7.00, see Page 523 of the "Microsoft BASIC 7.0: Programmer's
	Guide" included with the product.
	
	For more information on DosQCurDisk(), see Page 547 of "Advanced OS/2
	Programming," by Ray Duncan (Microsoft Press, 1989).
	
	Note that BASIC PDS version 7.00 supports the function "CURDIR$",
	which can also be used to get the currently selected drive. However,
	using this method requires some string parsing, so although the code
	is smaller, it may be slower.
	
	The sample program below (GETDRIVE.BAS) reports the currently selected
	drive.
	
	To compile the program, use the following:
	
	   bc getdrive /lp;
	
	To link the program for BASIC 6.00 and 6.00b, use the following:
	
	   link /nop getdrive,,,doscalls;
	
	To link the program for BASIC 7.00, use the following:
	
	   link /nop getdrive,,,os2;
	
	Code Example
	------------
	
	' This declaration was taken from the include file
	' BSEDOSFL.BI
	
	DECLARE FUNCTION DosQCurDisk% (SEG CurrentDrive AS INTEGER,_
	                               SEG DriveBitmap  AS LONG)
	
	' CurrentDrive receives the current drive code (A=1, B=2,
	' etc.)
	' DriveBitmap receives a bitmap of each logical drive's
	' availability
	
	ErrorCode% = DosQCurDisk% (CurrentDrive%, DriveBitmap&)
	
	IF ErrorCode% THEN
	   PRINT "An error occurred, the code is";ErrorCode%
	ELSE
	   PRINT "The current drive is "; CHR$(CurrentDrive% + 64)
	END IF
	
	END
