---
layout: page
title: "Q45909: Example of How to Use 1- and 2-Byte Return Codes from INKEY&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q45909/
---

## Q45909: Example of How to Use 1- and 2-Byte Return Codes from INKEY&#36;

	Article: Q45909
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890606-37 B_BasicCom
	Last Modified: 13-DEC-1989
	
	The following information applies to QuickBASIC Versions 3.00, 4.00,
	4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b,
	and to Microsoft PDS Version 7.00. The Version 4.50 QuickBASIC Advisor
	and the BASIC PDS 7.00 Microsoft Advisor on-line Help system state the
	following:
	
	   The INKEY$ function returns a 1- or 2-byte string containing a
	   character read from the standard input device. A null string is
	   returned if no character is waiting there. A 1-character string
	   contains the actual character read from the keyboard, while a
	   2-character string indicates an extended code, the first character
	   of which is hexadecimal 00.
	
	When two bytes are received from an extended key, the second character
	of the string is the scan code associated with the extended key. The
	chart in the Version 4.50 QuickBASIC Advisor and Microsoft Advisor
	on-line Help system for BASIC PDS 7.00 contains the scan code listing.
	The extended keys include the function keys, arrow keys, HOME, PGUP,
	END, PGDN, and SHIFT+TAB keys.
	
	The following program example demonstrates how to use the INKEY$
	function to return either a 1-byte character or 2-byte extended code.
	The length, ASCII representation, and the numeric representation for
	each key that is pressed are displayed. In addition, the arrow keys
	and the SHIFT+TAB key combination are trapped for 2-byte returns, and
	the ESC, TAB, and SPACEBAR are trapped for 1-byte returns.
	
	Code Example
	------------
	
	'SCAN CODES to be used with a 2-byte return code from INKEY$
	CONST left = &H4B
	CONST right = &H4D
	CONST up = &H48
	CONST down = &H50
	CONST tabscan = 15
	
	'ASCII CODES  to be used with a 1-byte return from INKEY$
	CONST escape = 27
	CONST tabchar = 9
	CONST space = 32
	
	DO UNTIL UCASE$(t$) = "Q"  'PROGRAM ENDS WHEN 'Q' OR 'q' IS ENTERED
	 CLS
	 LOCATE 23, 35
	 PRINT "Q to quit"
	 t$ = INKEY$
	 IF t$<>"" THEN
	  LOCATE 10, 1
	  length% = LEN(t$)
	  PRINT "length "; length%
	  PRINT "ASCII representation "; t$
	  PRINT "numeric representation ";
	  SELECT CASE length%
	         CASE 2
	           FOR i = 1 TO 2
	             PRINT ASC(MID$(t$, i, 1)); " ";
	           NEXT i
	                 SELECT CASE ASC(RIGHT$(t$, 1))
	                         CASE up
	                          PRINT "up           "
	                         CASE down
	                          PRINT "down         "
	                         CASE left
	                          PRINT "left         "
	                         CASE right
	                          PRINT "right        "
	                         CASE tabscan
	                          PRINT "Shift tab"
	                 END SELECT
	         CASE 1
	           PRINT ASC(t$);
	           SELECT CASE ASC(LEFT$(t$, 1))
	                 CASE escape
	                   PRINT "escape       "
	                 CASE tabchar
	                   PRINT "tab character"
	                 CASE space
	                   PRINT "space        "
	           END SELECT
	         CASE ELSE
	           PRINT "                    "
	  END SELECT
	 END IF
	LOOP
	END
