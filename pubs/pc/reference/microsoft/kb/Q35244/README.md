---
layout: page
title: "Q35244: To Suppress Linefeed, OPEN &quot;lpt1&quot; BINARY or &quot;LPT1:BIN&quot; RANDOM"
permalink: /pubs/pc/reference/microsoft/kb/Q35244/
---

## Q35244: To Suppress Linefeed, OPEN &quot;lpt1&quot; BINARY or &quot;LPT1:BIN&quot; RANDOM

	Article: Q35244
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890508-55
	Last Modified: 12-DEC-1989
	
	When the LPRINT statement sends CHR$(13) (a carriage return) to the
	printer, it automatically adds a linefeed, CHR$(10). This automatic
	linefeed prevents the ability to overtype or underline a previously
	printed line.
	
	The following methods let you suppress the automatic linefeed, as
	shown in complete programs further below:
	
	1. OPEN "LPT1:BIN" FOR RANDOM AS #n
	   WIDTH#n,255
	
	2. OPEN "lpt1" FOR BINARY #n
	   [Note that this method requires the "lpt1" device name to have
	   no colon (:).]
	
	These methods should also be used if you want to send control
	characters to your printer, such as for printer-graphics mode.
	Otherwise, the programs below can create garbled graphics output [e.g.
	the extra linefeed is printed after byte values of 13, and ASCII
	values of 9 (horizontal tab) are converted to 8 spaces].
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	You cannot suppress the LPRINT statement's linefeed that is
	automatically sent along with a carriage return. Instead, you must use
	PRINT#n to send output to special device names as shown in the
	examples below.
	
	The following programs demonstrate how to print a carriage return (the
	ASCII character 13) without an automatic linefeed.
	
	Example of Using "LPT1:BIN" Device Name FOR RANDOM Output
	---------------------------------------------------------
	
	OPEN "LPT1:BIN" FOR RANDOM AS #1
	WIDTH#1,255
	PRINT #1, "This is a test to do underlining.";
	PRINT #1, CHR$(13);
	PRINT #1, "_________________________________";
	PRINT #1, CHR$(13);
	CLOSE #1
	
	Example of Using "LPT1" Device Name FOR BINARY Output
	-----------------------------------------------------
	
	REM  This sample program overprints on one line,
	REM  allowing you to underline the text "Seattle Times".
	C$ = CHR$(13)         ' 13 = ASCII code for carriage return
	LPRINT
	OPEN "lpt1" FOR BINARY AS #1
	LPRINT "Seattle Times";
	PUT #1, , C$
	LPRINT "_______ _____"
	CLOSE #1
	END
	
	Overprinting Using "LPT1:", "LPT1:BIN", and "LPT1:" in Sequence
	---------------------------------------------------------------
	
	' This works in QuickBASIC but not in GW-BASIC.
	' This program should output the following:
	' program output: hello world
	' "hello" should print over itself twice.
	CLS
	OPEN "lpt1:" FOR OUTPUT AS #1
	PRINT #1, "program output:  "
	CLOSE
	OPEN "lpt1:bin" FOR OUTPUT AS #1
	FOR I = 1 TO 3
	   PRINT #1, CHR$(&HD);    ' Carriage Return with no Line Feed
	   PRINT #1, "hello";
	NEXT
	CLOSE
	OPEN "lpt1:" FOR OUTPUT AS #1
	PRINT #1, " world."
	CLOSE
	PRINT "done printing"
	END
