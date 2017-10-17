---
layout: page
title: "Q65103: OS/2 BASIC Program to Get Machine Configuration; DosDevConfig"
permalink: /pubs/pc/reference/microsoft/kb/Q65103/
---

## Q65103: OS/2 BASIC Program to Get Machine Configuration; DosDevConfig

	Article: Q65103
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900820-52
	Last Modified: 4-SEP-1990
	
	A protected mode BASIC program can call the OS/2 API function
	DosDevConfig() to find out machine-configuration information, such as
	how many printers are attached, how many serial ports and floppy disk
	drives are available, whether or not a math coprocessor is present,
	and the type of primary display adapter (monochrome or color). Below
	is a sample program demonstrating this.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS OS/2.
	
	DosDevConfig() takes the following parameters:
	
	   Parameter   Description
	   ---------   -----------
	
	   PTR BYTE    Receives machine information
	
	   WORD        Type of information needed
	               0 = Number of printers attached
	               1 = Number of serial ports available
	               2 = Number of floppy disk drives available
	               3 = Check math coprocessor (returns 1 = present, 0 = not)
	               4 = PC Submodel type
	               5 = PC model type
	               6 = Primary display adapter type (returns 0 = monochrome,
	                   1 = color)
	
	   WORD        Reserved by OS/2, must be set to 0
	
	BASIC 6.00 and 6.00b and BASIC PDS 7.00 and 7.10 can directly call
	OS/2 API functions by linking with the DOSCALLS.LIB (for 6.00 and
	6.00b) or OS2.LIB (for 7.00 and 7.10) libraries. Note that a BYTE in
	BASIC has a type of STRING * 1, and a WORD has a type of INTEGER.
	Also, data items preceded by PTR can be passed using the SEG keyword
	in the DECLARE statement; otherwise, BYVAL is used.
	
	For more information on DosDevConfig(), see Pages 509-510 of "Advanced
	OS/2 Programming" by Ray Duncan (Microsoft Press, 1989).
	
	The following sample program (MACHINFO.BAS) displays configuration
	information about the machin, namely, how many printers are attached,
	how many serial ports and floppy disk drives are available, whether or
	not a math coprocessor is present, and the type of primary display
	adapter (monochrome or color). Note that a printer does not have to be
	online to be "attached."
	
	To compile the program, enter the following at the OS/2 command
	prompt:
	
	   bc machinfo;
	
	The LINK command line for BASIC 6.00 and 6.00b is as follows:
	
	   link /nop machinfo,,,doscalls;
	
	The LINK command line for BASIC PDS 7.00 and 7.10 is as follows:
	
	   link /nop machinfo,,,os2;
	
	MACHINFO.BAS
	------------
	
	DEFINT A-Z
	
	TYPE InfoType
	   Info AS STRING * 1
	END TYPE
	
	DECLARE FUNCTION DosDevConfig% (SEG InfoVar AS InfoType,_
	                                BYVAL InfoNeeded%, BYVAL Reserved%)
	
	DIM InfoVar AS InfoType   'Will receive configuration information.
	
	'Get number of printers attached.
	ErrorCode% = DosDevConfig% (InfoVar, 0, 0)
	PRINT "There are" CVI(InfoVar.Info + CHR$(0)) " printers attached."
	
	'Get number of serial ports available.
	ErrorCode% = DosDevConfig% (InfoVar, 1, 0)
	PRINT CVI(InfoVar.Info + CHR$(0)) " serial ports are available."
	
	'Get number of floppy disk drives available.
	ErrorCode% = DosDevConfig% (InfoVar, 2, 0)
	PRINT CVI(InfoVar.Info + CHR$(0)) " disk drives are available."
	
	'Check if math coprocessor is available.
	ErrorCode% = DosDevConfig% (InfoVar, 3, 0)
	IF InfoVar.Info = CHR$(1) THEN
	   PRINT "A math coprocessor is present."
	ELSE
	   PRINT "A math coprocessor is not present."
	END IF
	
	'Get the type of primary display adapter (color or mono).
	ErrorCode% = DosDevConfig% (InfoVar, 6, 0)
	IF InfoVar.Info = CHR$(1) THEN
	   PRINT "The primary display adapter is color."
	ELSE
	   PRINT "The primary display adapter is monochrome."
	END IF
	
	END
