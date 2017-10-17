---
layout: page
title: "Q42663: Suppressing CR/LF on &quot;LPT1:BIN&quot; after Every 80 Printable Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q42663/
---

## Q42663: Suppressing CR/LF on &quot;LPT1:BIN&quot; after Every 80 Printable Bytes

	Article: Q42663
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890310-85 B_BasicCom
	Last Modified: 16-DEC-1989
	
	The two sample programs shown below suppress the automatic forcing of
	a LineFeed (LF) character that normally follows a Carriage Return (CR)
	character sent to the printer.
	
	The "LPT1:BIN" device requires a WIDTH#n,255 statement to suppress
	CR/LF pairs added by BASIC after every 80th printable ASCII character.
	The "LPT1" device doesn't require a WIDTH#n statement.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00.
	
	Example 1, which uses the BASIC device name "LPT1", does not require a
	WIDTH#n statement to suppress extra CR/LF pairs.
	
	Example 2, which uses the BASIC device name "LPT1:BIN", requires the
	statement WIDTH#n,255 to prevent BASIC from appending a Carriage
	Return plus LineFeed (Hex 0A plus Hex 0D) pair to the characters Hex
	6F (decimal 111) and Hex BF (decimal 191). (Bytes 111 and 191 are 80
	bytes apart. Bytes 0 through 31 at the beginning are not counted in
	the width.)
	
	To examine printer byte values more easily, the printer should be
	initialized in Hex dump mode. (On an Epson printer, Hex dump mode is
	turned on by holding down the Form Feed button while turning on the
	printer. Refer to your printer manual if your printer differs.)
	
	Code Example
	------------
	
	REM **** Program 1 ****
	OPEN "LPT1" FOR BINARY AS #1
	FOR I = 0 TO 255
	    C$= CHR$(I)
	    PUT #1,,C$
	NEXT
	
	REM **** Program 2 ****
	' Adding WIDTH#1,255 eliminates the CR/LF addition for "LPT1:BIN":
	OPEN "LPT1:BIN" FOR RANDOM AS #1
	' WIDTH#1,255    ' Required to suppress CR/LF at bytes 111 and 191.
	FOR I = 0 TO 255
	   PRINT#1, CHR$(I);
	NEXT
