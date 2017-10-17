---
layout: page
title: "Q62216: QBX Hangs Using KEY with Two or More Characters, Then INPUT&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q62216/
---

## Q62216: QBX Hangs Using KEY with Two or More Characters, Then INPUT&#36;

	Article: Q62216
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 fixlist7.10 SR# S900517-71
	Last Modified: 29-JAN-1991
	
	The program below hangs in the QBX.EXE environment of Microsoft BASIC
	Professional Development System (PDS) version 7.00. The problem occurs
	when you specify two or more characters in the KEY statement's string
	to specify a softkey and follow that with an INPUT$ statement. After
	you run the program in the QBX.EXE environment, press the softkey, and
	press an additional key, the program hangs after it ends with the
	"Press any key to continue" message.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00. This problem is corrected in BASIC PDS version 7.10.
	
	This is only a problem in the QBX.EXE environment. This program works
	correctly when it is compiled to an .EXE program (with either the Near
	Strings or Far Strings option).
	
	To work around this problem in BASIC 7.00, do any of the following:
	
	1. Use the INPUT statement (or INKEY$ function in a loop) instead of
	   the INPUT$ function.
	
	2. Use only one character in the string for the KEY statement.
	
	The following code sample demonstrates this problem:
	
	   KEY 10, "*" + CHR$(13)   ' Any two or more characters produce problem.
	   my$ = INPUT$(1)          ' Press F10 then additional key as input.
	   print my$
