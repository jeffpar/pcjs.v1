---
layout: page
title: "Q47346: IBM PS/2 Video Problems with QuickBASIC 4.50 Under DOS 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q47346/
---

## Q47346: IBM PS/2 Video Problems with QuickBASIC 4.50 Under DOS 4.00

	Article: Q47346
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom
	Last Modified: 30-JAN-1990
	
	If you are using MS-DOS or PC-DOS Version 4.00, operating QuickBASIC
	4.50 on an IBM PS/2 Model 50 or 60 can lead to video problems (such as
	a garbled or rolling display) when you switch between 25-line and
	43-line screen modes. This also applies to a PS/2 Model 30 (286) with
	a VGA under MS-DOS 4.00. This problem does not occur in versions of DOS
	earlier than 4.00. Note that QuickBASIC Version 4.50 was released
	before DOS Version 4.00, and thus, was not tested under DOS 4.00.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50 running under MS-DOS Version 4.00 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS
	(buglist7.00). We are researching this problem and will post new
	information here as it becomes available.
	
	The problems described in Examples 1 and 2 (below) also apply to
	Microsoft BASIC PDS Version 7.00 for MS-DOS. The same problems occur
	with the QBX.EXE editor and programs compiled with BC.EXE in 7.00.
	
	Example 1
	---------
	
	The following steps reproduce this behavior:
	
	1. Boot under DOS 4.00 on an IBM PS/2 Model 50 or 60.
	
	2. Use the DOS MODE command to put the screen into 43-line mode (PS/2
	   Models 50 and 60 have VGA graphics), as follows:
	
	      MODE CO80,43
	
	3. Execute a compiled QuickBASIC Version 4.50 program that uses a
	   WIDTH statement to change the screen to 25-line mode, such as the
	   following one-line program:
	
	      WIDTH 80,25
	
	When the program terminates, the display will start rolling
	uncontrollably. You must reboot the computer to regain control.
	
	The same problem occurs if you start the QuickBASIC environment in
	43-line mode, and then change to 25-line mode using a WIDTH statement
	in the immediate window in the QB.EXE editor.
	
	Example 2
	---------
	
	If you start in DOS 4.00 with the default screen mode (MODE CO80,25),
	invoke the QB.EXE editor, and then invoke the WIDTH 80,43 statement to
	change to 43-line mode, the program printout rolls on the screen.
	However, you can recover from this problem by either ending the
	program, returning to the editor, or making the program reinvoke the
	default screen mode with the WIDTH 80,25 statement.
