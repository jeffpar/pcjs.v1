---
layout: page
title: "Q58225: &quot;Packed File Corrupt&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q58225/
---

## Q58225: &quot;Packed File Corrupt&quot; Error

	Article: Q58225
	Version(s): 3.x 4.x
	Operating System: MS-DOS
	Flags: ENDUSER | s_link s_c h_fortran s_pascal s_quickc h_masm b_basic
	Last Modified: 12-FEB-1991
	
	Question:
	
	When I attempt to run my program, I get the error message "Packed File
	Corrupt." What causes this error and how can I run my program?
	
	Response:
	
	The error is caused by a problem in the packed EXE loader that is
	incorporated into EXEPACKed files. This causes incorrect loading of
	packed files. The problem only occurs when the program is loaded into
	memory before the first 64K byte boundary.
	
	CHKDSK reports more than 589,824 bytes of free memory. Typically, this
	problem tends to occur with DOS Version 3.30 when you try to free up
	more memory by setting the files and buffers in your CONFIG.SYS file
	to less than their default values.
	
	To correct this problem, force DOS to load the program above the first
	64K of memory by increasing the amount of memory DOS uses. One way to
	do this is to fill up the first 64K segment with one or more copies of
	COMMAND.COM.
	
	You can also use copies of COMMAND.COM to diagnose the problem. Spawn
	a new command interpreter by typing "COMMAND" at the DOS prompt. Then
	try to run the program. Keep spawning copies of COMMAND.COM until the
	program runs. When the program runs, you have successfully filled the
	first 64K.
	
	If this method works, you may resolve the problem in a more permanent
	manner by increasing the number of files and buffers in the CONFIG.SYS
	file, and rebooting your machine.
	
	The EXEPACK utility compresses sequences of identical characters from
	a specified executable file. It also optimizes the relocation table,
	whose entries are used to determine where modules are loaded into
	memory when the program is executed. When the program is executed, it
	must first unpack the file into memory. It is the unpacking code that
	unpacks incorrectly and generates the "Packed File Corrupt" error.
	
	For more information on the EXEPACK utility, refer to Page 321 in the
	"Microsoft CodeView and Utilities" manual shipped with C version 5.10.
	For information on the /EXEPACK linker option, refer to the utilities
	manual or online help shipped with your particular version of the
	compiler or assembler.
	Additional reference words: b_quickbasic o_msdos h_mouse h_mspbrush
