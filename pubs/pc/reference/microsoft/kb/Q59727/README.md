---
layout: page
title: "Q59727: Legal Data Delimiters When Using INPUT #n Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q59727/
---

## Q59727: Legal Data Delimiters When Using INPUT #n Statement

	Article: Q59727
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900312-105 B_BasicCom docerr
	Last Modified: 10-AUG-1990
	
	This article corrects several documentation errors concerning how to
	delimit data in a sequential file that is to be read by the INPUT#
	statement.
	
	The INPUT# statement reads data items from a sequential device or file
	and assigns them to variables. If the data items in the file are
	numeric values, they should be separated with a space, carriage return
	(CR), or comma. Strings should be separated with a carriage return or
	a comma, or enclosed in double quotation marks. A linefeed (LF) by
	itself should not be used as a file delimiter in either case.
	
	The following references incorrectly state that a linefeed may be used
	as a delimiter between data items in a file. These references also
	omit the fact that string data may be delimited by a comma.
	
	1. Page 304 of the "Microsoft QuickBASIC Compiler" manual for versions
	   2.00, 2.01, and 3.00
	
	2. Page 225 of the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for QuickBASIC versions 4.00 and 4.00b
	
	3. Page 225 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for versions 6.00 and 6.00b
	
	4. Page 167 of the "Microsoft BASIC 7.0: Language Reference" manual
	   for Microsoft BASIC Professional Development System (PDS)
	   versions 7.00 and 7.10
	
	5. Under the INPUT# statement in the QB Advisor online Help system
	   for QuickBASIC version 4.50
	
	In addition, all the above references (except #4) incorrectly state
	that string data items may be delimited with spaces. Only numeric data
	items may be delimited with spaces. String data items must be
	delimited by a comma or a carriage return, or enclosed in double
	quotation marks.
	
	If you need some other character, such as a linefeed by itself, to act
	as a delimiter, then a file may be read in BINARY mode. When a file is
	opened in BINARY mode, the data is not interpreted and the program
	must be written to interpret or "filter" each character as needed.
	
	The following is a description of how the INPUT# statement handles a
	linefeed, carriage return, space, and comma if one of these characters
	is used as a delimiter between data items. Also, the program below
	exhibits the behavior of these characters when used as delimiters.
	
	Numeric Input Syntax: INPUT #n, <numeric variable>
	--------------------------------------------------
	
	This reads a linefeed in as a numeric value instead of a delimiter.
	Each time a linefeed is encountered, the linefeed character is treated
	as a data item and a value of 0 is returned for the input.
	
	A carriage return, space, or comma functions correctly as a delimiter
	for numeric input.
	
	String Input Syntax:  INPUT #n, <string variable>
	-------------------------------------------------
	
	This ignores the linefeed character completely. If two data items are
	separated by a linefeed and read in as strings, the two data items are
	read in as one string that is a concatenation of the two data items.
	
	A space between two data items causes the two data items to be read in
	as one string, and the space is an actual character in that string.
	
	A carriage return or comma functions correctly as a delimiter. If a
	comma appears between a pair of double quotation marks, the comma is
	treated as part of the string. A carriage return always acts as a
	delimiter, terminating any string delimited by a beginning double
	quotation mark.
	
	Sample Code
	-----------
	
	CLS
	INPUT "Enter 'q' to quit.  Enter 'c' to continue==> ", start$
	
	WHILE start$ <> "q"
	 CLS
	
	 OPEN "numeric.dat" FOR OUTPUT AS #1
	 OPEN "string.dat" FOR OUTPUT AS #2
	
	 PRINT "Input the ASCII code for the delimiter you wish to attempt:"
	 PRINT "   10 = line feed"
	 PRINT "   13 = carriage return"
	 PRINT "   32 = space"
	 INPUT "   44 = comma =============>", delimit%
	
	 num1% = 5: num2% = 10        'define data to be put in numeric file
	 str1$ = "hi": str2$ = "mom"  'define data to be put in string file
	
	 PRINT #1, num1%; CHR$(delimit%); num2%  'write data separated by
	 PRINT #2, str1$; CHR$(delimit%); str2$  'chosen delimiter to file
	
	 CLOSE
	
	 OPEN "numeric.dat" FOR INPUT AS #1
	 OPEN "string.dat" FOR INPUT AS #2
	
	 PRINT
	 count% = 0
	 PRINT "This file contains the numeric values 5 and 10."
	 PRINT "==============================================="
	 DO UNTIL EOF(1)
	     count% = count% + 1
	     INPUT #1, inp1%
	     PRINT "Value read in after"; count%; "input(s):"; inp1%
	 LOOP
	
	 PRINT
	 count% = 0
	 PRINT "This file contains the string values 'hi' and 'mom'."
	 PRINT "===================================================="
	 DO UNTIL EOF(2)
	     count% = count% + 1
	     INPUT #2, inp2$
	     PRINT "Value read in after"; count%; "input(s): "; inp2$
	 LOOP
	
	 CLOSE
	
	 PRINT : PRINT
	 INPUT "Press 'q' to quit.  Press 'c' to continue==> ", start$
	WEND
	END
