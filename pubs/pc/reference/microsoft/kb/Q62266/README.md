---
layout: page
title: "Q62266: QB.EXE/QBX.EXE Incorrectly Allows GO As a Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q62266/
---

## Q62266: QB.EXE/QBX.EXE Incorrectly Allows GO As a Variable

	Article: Q62266
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 2-JAN-1991
	
	The QB.EXE and QBX.EXE environments incorrectly allow the keyword GO
	to be used as a variable. The BC.EXE compiler correctly flags this
	usage as a syntax error.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	in Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS (buglist6.00,
	buglist6.00b); and in the QBX.EXE environment in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS
	(buglist7.00). This problem is corrected in Microsoft BASIC PDS 7.10
	(fixlist7.10).
	
	This error is not trapped in the QB.EXE/QBX.EXE environments because
	GO is not a keyword on its own. GO must always be used with the
	keywords TO or SUB to complete the combined phrases GOTO and GOSUB.
	Because QB.EXE and QBX.EXE both format the code as it is entered, "GO
	TO" is changed to be "GOTO". Thus, GO on its own is not checked during
	QBX.EXE's final pass in creating the internal pseudocode (pcode).
	
	The following code example fails to give an error in the QB.EXE and
	QBX.EXE environments, but correctly causes a "Syntax error" when
	compiled with BC.EXE:
	
	   GO = 1
