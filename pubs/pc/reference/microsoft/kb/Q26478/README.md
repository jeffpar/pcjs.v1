---
layout: page
title: "Q26478: DOS APPEND Path Can Affect Make EXE File Command in QB/QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q26478/
---

## Q26478: DOS APPEND Path Can Affect Make EXE File Command in QB/QBX.EXE

	Article: Q26478
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 5-SEP-1990
	
	Using the Make EXE File command on the Run menu in the QuickBASIC
	version 4.00, 4.00b, or 4.50 environment fails to make an EXE file
	when the MS-DOS APPEND command points to the directory where QB.EXE
	and BC.EXE are located and you are running QB.EXE from a different
	directory.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of QuickBASIC versions 4.00, 4.00b, and 4.50; in the QB.EXE
	environment of Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS (buglist6.00, buglist6.00b); and in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10).
	
	The following steps demonstrate the problem:
	
	1. Put BC.EXE and QB.EXE in a directory called C:\QB.
	
	2. Type the following DOS PATH command:
	
	      PATH=C:\QB
	
	3. Type the following DOS command:
	
	      APPEND C:\QB
	
	4. Log onto the following:
	
	      C:\QB\BUGS
	
	5. Run QB.EXE and load in any simple program to compile.
	
	6. When you attempt to use the Make EXE File command on the Run menu,
	   you shell out to DOS but immediately get a prompt to "Press any key
	   to continue," and no EXE file is created. Control is immediately
	   returned to the editor even if you use the Make .EXE and EXIT
	   command.
	
	To work around this problem, put BC.EXE in a subdirectory other than
	the one specified by the DOS APPEND command.
