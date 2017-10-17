---
layout: page
title: "Q31471: &#36;INCLUDE Forces Extra Linefeeds in Print from QB.EXE File Menu"
permalink: /pubs/pc/reference/microsoft/kb/Q31471/
---

## Q31471: &#36;INCLUDE Forces Extra Linefeeds in Print from QB.EXE File Menu

	Article: Q31471
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	When you choose the Print option from the QuickBASIC editor's File
	menu to print the source listing of a QuickBASIC program that uses the
	REM $INCLUDE metacommand, blank lines are appended to the end of the
	printed listing. The number of blank lines added corresponds to the
	number of lines in the included file.
	
	Microsoft has confirmed this to be a problem in QB.EXE in QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in the QB.EXE in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00,
	buglist6.00b). This problem has been corrected in the QBX.EXE of the
	Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	The following are two ways to view this problem:
	
	1. Load only the program module that contains the REM $INCLUDE
	   statement into the editor; do not load the included file. Next,
	   select the Print...Current Module option from the File menu.
	
	   In addition to the printing of the program, there will be blank
	   lines added to the end of the listing, one blank line for each line
	   in the include file.
	
	2. The same problem occurs if the include file is also loaded.
	   Multiple blank lines will be inserted between the printout of the
	   program module and the include file. In this case, the option
	   Print...All modules is selected from the File menu.
	
	In either of these two cases, if the included lines are being viewed
	(i.e., the option Included Lines has been chosen from the View menu),
	the files are printed without the insertion of blank lines. Results of
	testing with previous versions indicate that blank lines are not
	inserted when the program is printed from the QuickBASIC Version 2.00
	or 3.00 editor.
	
	As a workaround, invoke the Included Lines option from the View menu
	prior to printing. The following is a code example:
	
	   ' Program TEST.BAS
	   REM
	   REM
	   REM
	   REM $INCLUDE: 'TEST.INC'
	   REM
	   PRINT "all done"
	
	   ' This is the included file TEST.INC
	
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
	   PRINT "in the include file"
