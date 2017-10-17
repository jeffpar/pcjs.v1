---
layout: page
title: "Q68122: BASIC Can Write Files for MS Excel Spreadsheet"
permalink: /pubs/pc/reference/microsoft/kb/Q68122/
---

## Q68122: BASIC Can Write Files for MS Excel Spreadsheet

	Article: Q68122
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901029-75 B_MQuickB B_BasicCom B_BasicInt W_eXceL M_eXc
	Last Modified: 15-JAN-1991
	
	Microsoft QuickBASIC can manipulate ASCII text files used by Microsoft
	Excel in either comma separated values (CSV) or tab separated values
	(TEXT) file formats.
	
	QuickBASIC can generate these file formats with the standard BASIC
	statements OPEN, CLOSE, PRINT, and WRITE.
	
	This information applies to Microsoft QuickBASIC versions 1.00, 2.00,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2; Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2; Microsoft BASIC Interpreter versions 2.00, 2.01,
	and 3.00 for Apple Macintosh; Microsoft QuickBASIC versions 1.00 and
	1.00b for Apple Macintosh; Microsoft BASIC Compiler version 1.00 for
	Apple Macintosh; and GW-BASIC Interpreter versions 3.20, 3.22, and
	3.23 for MS-DOS.
	
	Microsoft Excel supports two TEXT file formats: tab (TEXT) files, and
	comma (CVS) delimited files. Both of these files contain the textual
	information in each cell, no formulas, and a delimiter between each
	column and a carriage return plus linefeed (CR/LF) at the end of each
	row on MS-DOS computers (but just CR ending each row on Macintosh
	computers).
	
	Tab delimited files have a tab character separating each column. To
	generate a tab character in BASIC, use the CHR$() function with a
	parameter of 9. For example,
	
	   Tab$ = CHR$(9)
	
	Comma delimited files have a comma character separating each column.
	There are several ways to generate a comma in the output file. One way
	is to use BASIC's CHR$() function with a parameter of 44. For example,
	
	   Comma$ = CHR$(44)
	
	If a cell contains a comma, the value from the cell will be enclosed
	in double quotation marks. In BASIC, you can use the WRITE command to
	place an item in double quotation marks.
	
	BASIC Code Example
	------------------
	
	        REM ** Create a COMMA Delimited File **
	        Comma$ = CHR$(44)
	        OPEN "EXCEL.CVS" FOR OUTPUT AS #1
	        PRINT #1, "Employee Information"
	        PRINT #1, " "
	        PRINT #1, "First"; Comma$; "Last Name"; Comma$; "Age"
	        PRINT #1, " "
	        PRINT #1, "Loren"; Comma$; "Moe"; Comma$; 35
	        PRINT #1, "Arthur"; Comma$; "Nelson"; Comma$; 21
	        PRINT #1, "George"; Comma$; "Merriman";Comma$; 30
	        PRINT #1, " "
	        CLOSE #1
	
	        REM ** Creates a TAB Delimited File **
	        Tab$ = CHR$(9)
	        OPEN "EXCEL.TXT" FOR OUTPUT AS #2
	        PRINT #2, "Employee Information"
	        PRINT #2, " "
	        PRINT #2, "First"; Tab$; "Last Name"; Tab$; "Age"
	        PRINT #2 " "
	        PRINT #2, "Loren"; Tab$; "Moe"; Tab$; 35
	        PRINT #2, "Arthur"; Tab$; "Nelson"; Tab$; 21
	        PRINT #2, "George"; Tab$; "Merriman"; Tab$; 30
	        PRINT #2, " "
	        CLOSE #2
