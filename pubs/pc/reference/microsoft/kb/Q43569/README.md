---
layout: page
title: "Q43569: Program That Prints a Hex Dump of a File to LPT1"
permalink: /pubs/pc/reference/microsoft/kb/Q43569/
---

## Q43569: Program That Prints a Hex Dump of a File to LPT1

	Article: Q43569
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890413-101 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The following is QuickBASIC or BASIC compiler code that will print a
	HEX dump of a given file to a standard out or IBM or Epson printer
	connected to LPT1. This program is also a good example of how to get
	arguments from the command line and how to check if a file exists.
	
	This program will execute correctly with Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, with Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and with Microsoft BASIC PDS Version 7.00.
	
	The code example is as follows:
	
	DECLARE SUB banner ()
	DECLARE SUB filter (byte%)
	'======================= HEXDUMP.BAS ===============================
	' Program to print a Hexadecimal dump of a file to a standard out or
	' IBM or Epson printer connected to the LPT1: port.
	'===================================================================
	DEFINT A-Z
	CONST TRUE = -1
	CONST FALSE = NOT TRUE
	
	ON ERROR GOTO handler
	CLS
	datafile$ = COMMAND$                'Get filename from command line
	
	  IF datafile$ = "" THEN            'Check for no filename input
	     LOCATE 12
	     PRINT "Usage  c:>hexdump [filename]   Output goes to LPT1:"
	     END
	  END IF
	
	OPEN datafile$ FOR INPUT AS #1      'Easy way to check for file exit
	CLOSE #1                            'IF NOT ERROR will force jump to
	
	OPEN datafile$ FOR BINARY AS #1
	CALL banner
	DO UNTIL EOF(1) = TRUE              'Read the file 2 bytes at a time
	   ascii$ = ""
	   offset$ = HEX$(LOC(1))
	   offlen = LEN(offset$)
	
	   out$ = STRING$(8 - offlen, 48) + offset$ + ":  "
	   FOR i% = 1 TO 8
	      GET #1, , dataword
	      IF EOF(1) = TRUE THEN
	         fudge = 47 - (3 * (LOF(1) MOD 16) - 1)
	         ascii$ = SPACE$(fudge + 3) + ascii$
	         EXIT FOR
	      END IF
	
	      IF dataword < 0 THEN
	         highbyte = (dataword + 2 ^ 16) \ 256
	      ELSE
	         highbyte = dataword \ 256  'Integer divide off low byte
	      END IF
	
	      lowbyte = dataword AND 255    'AND off the top byte
	      CALL filter(highbyte)
	      CALL filter(lowbyte)
	      lowbyte$ = RIGHT$("0" + HEX$(lowbyte), 2)
	      highbyte$ = RIGHT$("0" + HEX$(highbyte), 2)
	      out$ = out$ + " " + lowbyte$ + " " + highbyte$
	
	      ascii$ = ascii$ + CHR$(lowbyte) + CHR$(highbyte)
	   NEXT i%
	'  LPRINT out$ + "   " + ascii$    'Remove comment for printed output
	   PRINT out$ + "   " + ascii$
	LOOP
	END
	
	handler:
	   PRINT "An ERROR has occurred: ERROR "; ERR
	 END
	
	'=================================================================
	'                        Prints the heading banner
	'=================================================================
	SUB banner
	  PRINT "__________________________ HEXDUMP ________________________"
	  PRINT
	  PRINT "Length of"; COMMAND$; " ["; HEX$(LOF(1)); "] Hex Bytes";
	  PRINT "    "; LOF(1); " Decimal Bytes"
	  PRINT "___________________________________________________________"
	  PRINT
	  VIEW PRINT 5 TO 25
	END SUB
	
	SUB filter (byte%)
	SELECT CASE byte%
	  CASE 7, 9, 10, 11, 12, 13, 14, 27
	     byte% = 32
	  END SELECT
	END SUB
