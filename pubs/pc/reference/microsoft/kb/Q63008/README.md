---
layout: page
title: "Q63008: DEFINT A:DEFLNG B Before SUB Gives &quot;Cannot Precede SUB&quot; in QB"
permalink: /pubs/pc/reference/microsoft/kb/Q63008/
---

## Q63008: DEFINT A:DEFLNG B Before SUB Gives &quot;Cannot Precede SUB&quot; in QB

	Article: Q63008
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 8-NOV-1990
	
	Placing two DEFtype statements (DEFINT, DEFLNG, DEFSNG, DEFDBL,
	DEFSTR, or DEFCUR) on the same line separated by a colon incorrectly
	gives the error "Statement cannot precede SUB/FUNCTION definition" in
	QB.EXE and "Invalid statement preceding SUB/FUNCTION definition" in
	QBX.EXE. The BC.EXE compiler correctly compiles this line without
	error.
	
	To work around this problem, place each DEFtype on a separate line
	before the SUB/FUNCTION line.
	
	Microsoft has confirmed this to be a problem with the QB.EXE
	environment of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in
	the QB.EXE environment of Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS (buglist6.00, buglist6.00b); and in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	To reproduce this problem, add the following line before any SUB or
	FUNCTION in the QB.EXE or QBX.EXE environment:
	
	   DEFINT A:DEFLNG B
	
	The resulting SUB will appear as follows:
	
	   DEFINT A:DEFLNG B
	   SUB test
	   ...
	   END SUB
	
	To work around this problem, enter each DEFtype as a separate line, as
	follows:
	
	   DEFINT A
	   DEFLNG B
	   SUB test
	   ...
	   END SUB
	
	Note that if you load a program resembling this into the QB.EXE or
	QBX.EXE editor, the editor will automatically put each DEFtype
	statements on its own line and remove the colon.
