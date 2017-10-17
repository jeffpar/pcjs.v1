---
layout: page
title: "Q68026: Unexpected Results Using DOS TYPE to Display RANDOM File"
permalink: /pubs/pc/reference/microsoft/kb/Q68026/
---

## Q68026: Unexpected Results Using DOS TYPE to Display RANDOM File

	Article: Q68026
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901119-101 B_BASICCOM B_GWBasicI
	Last Modified: 9-JAN-1991
	
	When you display the contents of a BASIC RANDOM or BINARY access file
	with DOS's TYPE command, you may see unexpected or extra characters
	(as in example 1 below) and/or the file may appear truncated (as in
	example 2). This is because the TYPE command is designed to only
	display ASCII text files. Using the TYPE command on a non-ASCII file
	will produce output that resembles a corrupted or invalid file, but is
	actually valid binary numeric information readable from certain
	programs.
	
	This behavior of the DOS TYPE command occurs for binary numeric data
	stored files created in most Microsoft BASICs:
	
	1. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, 4.50 for MS-DOS (BINARY access was introduced in
	   QuickBASIC 4.00 and later).
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS.
	
	3. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2.
	
	4. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, 3.23 for
	   MS-DOS (RANDOM access supported, but not BINARY access).
	
	If extra text, which you did not write, appears in a file opened with
	RANDOM access, then you may be mistakenly writing a record size
	smaller than the RANDOM record buffer size you specified in your OPEN
	statement. (See example 1 below.)
	
	When you OPEN a file with RANDOM or BINARY access, PUT writes a
	numeric (INTEGER, LONG, CURRENCY, SINGLE, or DOUBLE) variable with a
	bit-by-bit representation. For instance, if you PUT the INTEGER 35 to
	a RANDOM file, the DOS TYPE command will not display 35, but will
	instead display an ASCII representation of the 2 bytes that make up
	the integer variable:
	
	                                         Byte 1        Byte 2
	                                         ------        ------
	
	   Binary integer representation of 35:  00000000      00100011
	   Decimal value of byte:                0             35
	   ASCII Character representation:       NULL (blank)  #
	
	Because an INTEGER variable is stored in 2 bytes in two's complement
	signed binary integer format, DOS's TYPE command will display the
	INTEGER 35 as an ASCII blank followed by the ASCII # character.
	
	Thus, byte values from 0 to 255 will be displayed by DOS's TYPE
	command as control characters (ASCII 0 through 31), normal text (ASCII
	32 through 127), and line draw, symbolic, and foreign alphabetic
	characters (extended ASCII 128 through 255).
	
	Also, if DOS's TYPE command encounters any binary byte value equal to
	26, the output will be truncated at that point because TYPE treats 26
	(or CTRL+Z) as an end-of-file marker for ASCII text files.
	
	Code Examples
	=============
	
	The sample programs below apply to Microsoft QuickBASIC versions 4.00,
	4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2. (Earlier BASIC versions do not support the TYPE...END TYPE
	statement, or the new third argument for the PUT statement syntax,
	which is used in the examples below.)
	
	Example 1:
	---------
	
	Below is an example of how extra characters will appear in your RANDOM
	access file if you mistakenly write a record size smaller than the
	record buffer size you specified in your OPEN statement.
	
	When you OPEN a RANDOM access file, the PUT statement writes only as
	many characters as are in the variable being PUT. If the record length
	you specified in your OPEN statement exceeds the number of characters
	that you PUT, then PUT does not fill out the remainder of the record
	or clear the remaining information that was previously on the disk.
	This location may contain unpredictable data from an old file that was
	deleted. (To avoid this problem, make sure to PUT records of a size
	equal to the OPEN statement's record buffer length, and don't leave
	records or portions of records unwritten.)
	
	     TYPE FileOutput
	          TextString AS STRING * 50
	     END TYPE
	     DIM FileVar(3) AS FileOutput
	     FileVar(0).TextString = "Hello World"
	     FileVar(1).TextString = "Hello Again"
	     F$ = "TESTFILE.DAT"
	     OPEN F$ FOR RANDOM AS #1 LEN = 70
	     PUT 1, 1, FileVar(0)
	     PUT 1, 2, FileVar(1)
	     GET 1, 1, FileVar(2)
	     GET 1, 2, FileVar(3)
	     CLOSE #1
	     PRINT FileVar(2).TextString        'Prints correct information
	     PRINT FileVar(3).TextString        'Prints correct information
	     SHELL "TYPE TESTFILE.DAT"          'May show extra characters
	     'Extra characters will appear in positions 51-70.
	
	Also, the following example demonstrates how you can apparently
	receive extra characters in a variable.
	
	     TYPE FileIO1
	          TextString AS STRING * 50
	     END TYPE
	     TYPE FileIO2
	          TextString AS STRING * 70
	     END TYPE
	     DIM FileVar1 AS FileIO1
	     DIM FileVar2 AS FileIO2
	     FileVar1.TextString = "Hello From 1"
	     OPEN "TESTFILE.DAT" FOR RANDOM AS #1 LEN = 70
	     PUT 1, 1, FileVar1
	     PUT 1, 2, FileVar1
	     GET 1, 1, FileVar2
	     PRINT FileVar2           ' May contain extra characters
	     CLOSE #1
	
	Example 2:
	---------
	
	DOS's TYPE command will print the contents of a file to the screen
	until it reads an end-of-file (EOF) marker, a byte value equal to 26.
	(But in the File Allocation Table on disk, MS-DOS itself keeps track
	of the exact length of the file, instead of using CTRL+Z to mark the
	end of file.)
	
	It is possible for a byte value equal to 26 to correctly occur in your
	random access file without your realization. An example of this
	follows. (This example requires QuickBASIC 4.00b or later, where a
	2-byte string length is written to disk in front of variable-length
	strings written as the third argument of the PUT statement.)
	
	   FileName$ = "TESTFILE.DAT"
	   OPEN FileName$ FOR RANDOM AS #1 LEN = 80
	   FOR I = 1 TO 5
	      READ L$
	      'L$ = LEFT$(L$+SPACE$(80), 78)   'Gets rid of extra characters
	      PUT 1,,L$
	   NEXT I
	   CLOSE #1
	   SHELL "TYPE TESTFILE.DAT"
	   DATA "This line is fine"
	   DATA "This line is also fine"
	   DATA "This line is 26 characters"
	   DATA "This line won't be printed by TYPE"
	   DATA "neither will this line"
	
	The results will be:
	
	   ##This line is fine***********************************
	   ##This line is also fine******************************
	
	Note: ## refers to the 2-byte string length; * refers to a possible
	extra character.
	
	The third through fifth lines are not printed because QuickBASIC
	includes a 2-byte integer, which stores the length of the string,
	before each variable length string. Because the third line is 26
	characters long, QuickBASIC stores a CHR$(26) before the third line.
	The DOS command TYPE then interprets the CHR$(26) as an EOF marker.
	
	Note that even though DOS's TYPE command did not display all of your
	file, you can still GET all the information in the file.
