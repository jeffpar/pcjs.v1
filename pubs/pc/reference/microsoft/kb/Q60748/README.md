---
layout: page
title: "Q60748: If COMSPEC Is Invalid, Invoking DOS Shell May Hang Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q60748/
---

	Article: Q60748
	Product: Microsoft C
	Version(s): 2.x 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_pwb s_quickasm s_editor
	Last Modified: 19-APR-1990
	
	If you set your COMSPEC environment variable to point to an invalid
	command interpreter, and then shell out of any DOS application, your
	machine will hang. This problem occurs because the file that COMSPEC
	points to is assumed to be a valid command interpreter and cannot be
	checked for validity.
	
	This is expected behavior. Because .COM files have no standard file
	header structure, they cannot be checked for validity. Therefore, DOS
	must assume that whatever the COMSPEC environment variable points to
	must be a valid command interpreter, and can do no further error
	checking.
	
	This behavior can easily be demonstrated in any program that allows
	you to access a DOS shell, including CodeView, Programmer's WorkBench
	(PWB), the Microsoft Editor (M), and the Quick environments. Type the
	following line at the DOS prompt:
	
	   set comspec=a:\foo.c ; Invalid command.com file
	
	Then enter a DOS application and shell out. Your machine will hang,
	and you may receive strange error messages.
	
	If you are running under OS/2, you will be warned about an invalid
	command interpreter when you attempt to shell to the operating system.
	Under OS/2, the system expects an .EXE file to be the command
	interpreter, and .EXE files have a standard, recognizable structure
	that can be checked.
