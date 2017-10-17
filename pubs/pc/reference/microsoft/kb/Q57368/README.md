---
layout: page
title: "Q57368: Explanation of Critical Error Codes Returned by ERDEV"
permalink: /pubs/pc/reference/microsoft/kb/Q57368/
---

## Q57368: Explanation of Critical Error Codes Returned by ERDEV

	Article: Q57368
	Version(s): 2.00 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891127-3  B_BasicCom B_GWBasicI
	Last Modified: 17-OCT-1990
	
	ERDEV is an integer function that returns an error code from the last
	device to declare a critical error. ERDEV is set by the critical error
	handler, interrupt 24Hex, when DOS detects a critical DOS call error.
	
	For block and character device errors, ERDEV will contain the error
	code from interrupt 24Hex in the lower 8 bits. For block devices only,
	bit positions 9 to 16 contain device-attribute information which is
	found in the device-driver header of the device that the error is
	coming from.
	
	The above information applies to Microsoft GW-BASIC versions 3.20,
	3.22, and 3.23; to Microsoft QuickBASIC versions 2.00, 3.00, 4.00,
	4.00b, and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS; and to Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS.
	
	When using Microsoft BASIC PDS version 7.00 or 7.10 for MS-DOS, ERDEV
	can also be set by a time-out error on the communications port and
	indicates which option in the OPEN COM statement (CD, CS, or DS) is
	experiencing the time-out.
	
	If ERDEV returns an error from a block device (such as a floppy disk
	drive or fixed disk) or from a character device (such as a terminal or
	printer), the low byte of ERDEV will return the DOS error code, a
	value between 0 and 12. The following is a list of these errors:
	
	    0  write-protect error
	    1  unknown unit
	    2  drive not ready
	    3  unknown command
	    4  date error (CRC)
	    5  bad request structure length
	    6  seek error
	    7  unknown media type
	    8  sector not found
	    9  printer out of paper
	   10  write fault
	   11  read fault
	   12  general failure
	   13  reserved
	   14  reserved
	   15  invalid disk change (MS-DOS version 3.0 only)
	
	For more information on DOS error codes, see INT 24H on Page 481 of
	"Advanced MS-DOS Programming, 2nd Edition," by Ray Duncan (Microsoft
	Press, 1988).
	
	If the device returning an error is a block device, the high byte of
	the integer returned by ERDEV will contain device attribute
	information. This device attribute information comes from the
	device-attribute word in the device header. The only bits from this
	word returned by ERDEV are bits 15, 14, 13, XX, 3, 2, 1, and 0, in
	that order. XX indicates that bits 12 through 4 of the
	device-attribute word will always return zero. The following is a
	description of the bits in the device-attribute word that are
	meaningful to ERDEV:
	
	     Bit
	   Position   Bit     Significance
	   --------   ---     ------------
	
	      8       15      0 if block device
	      7       14      1 if IOCTL read and write supported
	      6       13      1 if BIOS parameter block in boot sector
	                        should be used to determine media
	                        characteristics
	                      0 if media ID byte should be used
	      4        3      1 if current CLOCK$ device
	      3        2      1 if current NUL device
	      2        1      1 if driver supports 32-bit sector addressing
	                        (MS-DOS 4.00)
	      1        0      1 if current standard input device (stdin)
	
	For more information on device-attribute words, see Page 264 of the
	"Advanced MS-DOS Programming" Microsoft Press book.
	
	When using BASIC PDS version 7.00, ERDEV also returns information for
	COM time-out errors in the low byte. If there is a time-out, ERDEV is
	set to a value that indicates the signal line that timed out,
	according to the following table:
	
	   ERDEV Value    Signal Line
	   -----------    -----------
	
	      128         Clear to Send (CTS) timeout
	      129         Data Set Ready (DSR) timeout
	      130         Data Carrier Detect (DCD) timeout
	
	The following program lines generate the DOS and COM time-out error
	codes (low byte) and device attribute information (high byte):
	
	   x= ERDEV
	   DosErrCode = x AND &HFF            'Low byte of ERDEV
	   DevAttr = (x AND &HFF00) \256      'High byte of ERDEV
	
	The following example prints the values of ERDEV after the program
	tries to OPEN a read only file for OUTPUT:
	
	Example
	-------
	
	DEFINT A-Z
	ON ERROR GOTO ErrorHandler
	OPEN "C:\TheFile.DAT" FOR OUTPUT A #1   'TheFile is a read-only
	                                        'file
	END
	
	ErrorHandler:
	   x = ERDEV
	   DosErrCode = x AND &HFF              'low byte of ERDEV
	   PRINT "The DOS error code returned by ERDEV => "; x
	RESUME NEXT
