---
layout: page
title: "Q28208: Printing Delayed when DOS PRINT Command Invoked from SHELL"
permalink: /pubs/pc/reference/microsoft/kb/Q28208/
---

## Q28208: Printing Delayed when DOS PRINT Command Invoked from SHELL

	Article: Q28208
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 7-FEB-1989
	
	If you invoke the DOS Print utility during a SHELL, the printer output
	does not print until you exit QuickBASIC. This problem occurs because
	DOS Print is a terminate-and-stay-resident (TSR) program.
	
	Note: You should never install a TSR program, such as DOS Print, with
	the SHELL statement because it fragments memory. This can result in
	the following error messages: "Out of Memory" and "Program Too Large
	to Fit in Memory". You must reboot to eliminate the memory
	fragmentation.
	
	If you must SHELL to a TSR program, it must have been installed in
	memory before running the QuickBASIC program. Note: Many TSR programs
	may conflict with QuickBASIC with other symptoms, and may not be
	compatible.
	
	We do not recommended you use DOS Print, or any TSR program, with
	QuickBASIC. Due to a memory conflict, the printing will be delayed
	when the DOS Print is invoked during the execution of a SHELL command.
	
	In the first example below, printing occurs immediately because the
	Print is invoked (i.e., loaded into memory) prior to the running of
	QuickBASIC. In this case, Print takes a portion of memory for its
	buffer, QuickBASIC loads, the SHELL executes, and the previously
	allocated buffer is used.
	
	If DOS Print is initially invoked by the SHELL statement itself, then
	printing does not occur until after exiting QuickBASIC. In this case
	QuickBASIC loads, the SHELL executes, Print tries to set up the buffer
	but does not have enough room so it spools. Once memory is freed up,
	either after exiting QuickBASIC or after the SHELL is executed, a
	print buffer can be allocated and the DOS Print is executed. Similar
	limitations occur in earlier versions of the QuickBASIC compiler.
	
	Below is the first example. DOS Print is loaded prior to running
	QuickBASIC, and no delayed printing occurs in the following example:
	
	1. Invoke DOS Print utility. Resident portion of Print gets loaded
	   into memory.
	
	2. Invoke the QuickBASIC editor (QB.EXE).
	
	3. Run the following program:
	
	             CLS
	             Shell "print filename"
	             End
	
	Below is the second example. DOS Print is loaded by the SHELL
	statement itself, and printing is delayed until after leaving
	QuickBASIC, and memory is fragmented in the following example:
	
	1. Reboot.
	
	2. Invoke the QuickBASIC editor (QB.EXE).
	
	3. Run the program above. Print loads resident portion.
