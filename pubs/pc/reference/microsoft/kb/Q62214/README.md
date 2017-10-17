---
layout: page
title: "Q62214: Calling API Function to Get All Available Drives"
permalink: /pubs/pc/reference/microsoft/kb/Q62214/
---

## Q62214: Calling API Function to Get All Available Drives

	Article: Q62214
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S900517-71
	Last Modified: 7-JUN-1990
	
	Microsoft BASIC Compiler versions 6.00 and 6.00b and Microsoft BASIC
	Professional Development System (PDS) version 7.00 protected mode
	programs can call the OS/2 API function DosQCurDisk() to get all the
	available logical drives. DosQCurDisk() requires the following
	parameters:
	
	   Parameter   Description
	   ---------   -----------
	
	   PTR WORD    Receives current drive code (1 = A, 2 = B, etc.)
	
	   PTR DWORD   Receives logical drive bitmap (logical drives A-Z
	               correspond to bits 0-25; a bit is set if a
	               logical drive exists)
	
	The first parameter is not important in getting the available drives,
	but it is worthy to note that for API functions, a WORD (2 bytes) has
	a BASIC type of INTEGER. Likewise, a DWORD (4 bytes) has a BASIC type
	of LONG. Since the specification requires pointers to these data
	items, the DECLARE statement for DosQCurDisk() uses the SEG keyword for
	each of the parameters. This causes 4-byte addresses of the parameters
	to be passed instead of 2-byte addresses, which is the default because
	BASIC uses the medium-memory model. Also, API functions return an
	error code, so for BASIC to retrieve this code, you must declare
	DosQCurDisk() as a FUNCTION.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and Microsoft BASIC (PDS) version 7.00 for MS OS/2.
	
	For more information on calling OS/2 API functions from Microsoft
	BASIC Compiler versions 6.00 and 6.00b, see Page 21 of the "Microsoft
	BASIC Compiler 6.0: User's Guide" included with the product.
	
	For more information on calling OS/2 API functions from Microsoft
	BASIC PDS version 7.00, see Page 523 of the "Microsoft BASIC 7.0:
	Programmer's Guide" included with the product.
	
	For more information on DosQCurDisk(), see Page 547 of "Advanced OS/2
	Programming," by Ray Duncan (Microsoft Press, 1989).
	
	To see a BASIC PDS 7.00 sample program that finds all the available
	drives in DOS or OS/2 real mode, query in this Knowledge Base on the
	word "chdrive".
	
	The following sample program (LOGICAL.BAS) reports all the available
	logical drives.
	
	To compile the program, use the following:
	
	   bc logical /lp;
	
	To link the program for BASIC 6.00 and 6.00b, use the following:
	
	   link /nop logical,,,doscalls;
	
	To link the program for BASIC 7.00, use the following:
	
	   link /nop logical,,,os2;
	
	Code Example
	------------
	
	' This declaration was taken from the include file
	BSEDOSFL.BI.
	
	DECLARE FUNCTION DosQCurDisk% (SEG CurrentDrive AS INTEGER,_
	                               SEG DriveBitmap  AS LONG)
	
	' CurrentDrive% receives the current drive code (A=1, B=2,
	' etc.). DriveBitmap& receives a bitmap of each logical
	' drive's availability.
	ErrorCode% = DosQCurDisk% (CurrentDrive%, DriveBitmap&)
	
	IF ErrorCode% THEN
	
	   PRINT "An error occurred, the code is";ErrorCode%
	
	ELSE
	
	   PRINT "The following drives are available:";
	
	   ' Bit% is used to circulate through bits 0-25 (drives A-Z)
	   ' of DriveBitmap&.  If (DriveBitmap& AND 2^Bit%) = 2^Bit%,
	   ' then bit Bit% of DriveBitmap& is set and the
	   ' corresponding logical drive is available.
	   FOR Bit% = 0 to 25
	      IF (DriveBitmap& AND 2^Bit%) = 2^Bit% THEN
	         PRINT " ";CHR$(Bit% + 65);
	      END IF
	   NEXT Bit%
	
	END IF
	
	END
