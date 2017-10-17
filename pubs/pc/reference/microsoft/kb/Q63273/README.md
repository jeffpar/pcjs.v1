---
layout: page
title: "Q63273: Editing Before First Line in Procedure Can Cause QB Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q63273/
---

## Q63273: Editing Before First Line in Procedure Can Cause QB Problems

	Article: Q63273
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom SR# S900115-
	Last Modified: 21-SEP-1990
	
	Editing before the first line in a SUB/FUNCTION procedure can cause
	problems in the QB.EXE and QBX.EXE environments. Normally, you would
	get the following correct message:
	
	   Blank lines not allowed before SUB/FUNCTION line. Is remark OK?
	
	However, in some cases, making other changes before the SUB/FUNCTION
	line can cause the QB and QBX environments to make unwanted changes.
	For example, if a remark is accepted for the line before the first
	line and then the comment line is deleted, the "Blank lines not
	allowed" message incorrectly appears and REMarks out the SUB/FUNCTION
	line.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	that comes with Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS and Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS (buglist6.00, buglist6.00b); and in the QBX.EXE environment
	that comes with Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	Besides comments, the only statements that are normally placed before
	SUB/FUNCTION lines are DEFtype statements (DEFINT, etc.). To place a
	DEFtype statement before the SUB/FUNCTION line, we recommend that you
	type it elsewhere in the program and use the cut and paste editing
	functions to move the DEFtype statement.
	
	To correct most editing problems such as this in the QBX.EXE editor,
	choose the Undo command from the Edit menu in BASIC PDS 7.00 or 7.10,
	which can undo as many as the last 20 modifications.
	
	The following information (from the QBX Help screen for the "Blank
	lines not allowed" dialog box) describes the behavior of the QBX
	editor with respect to blank lines before SUB/FUNCTION statements:
	
	   Ordinarily the SUB or FUNCTION statement that begins a
	   procedure is the first line in the View window. When you
	   try to use the smart editor to put a blank line above
	   the SUB or FUNCTION statement, the editor always transforms
	   that blank line into a comment line.
	
	To edit more easily before the first line in a SUB or FUNCTION, you
	can save the file in text format and use a different editor or word
	processor to edit the code.
