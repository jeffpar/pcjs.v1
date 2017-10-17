---
layout: page
title: "Q40154: QB.EXE &quot;OUT OF MEMORY&quot; after SHELL to DOS PRINT, MODE, ASSIGN"
permalink: /pubs/pc/reference/microsoft/kb/Q40154/
---

## Q40154: QB.EXE &quot;OUT OF MEMORY&quot; after SHELL to DOS PRINT, MODE, ASSIGN

	Article: Q40154
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881220-74 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The MS-DOS PRINT, MODE, and ASSIGN commands should not be run from the
	QuickBASIC environment during a SHELL or from a SHELL statement in an
	executable program. The MS-DOS PRINT, MODE, and ASSIGN commands remain
	resident in memory after being invoked. Subsequent attempts to LOAD
	another QuickBASIC program that is larger or adds more code to an
	existing program result in the error message "OUT OF MEMORY." You must
	exit QuickBASIC and reboot to eliminate this memory-fragmentation
	problem.
	
	When the MS-DOS PRINT, MODE, and ASSIGN commands are invoked, they are
	loaded into memory above QuickBASIC and the program loaded in the
	environment. This causes memory to become fragmented. Although there
	may be more memory above the resident commands, QuickBASIC will not
	recognize this memory.
	
	A QuickBASIC program that SHELLs to an MS-DOS batch file containing
	the PRINT, MODE, or ASSIGN command usually executes correctly.
	However, if an attempt is made to unload the current program and load
	in a program that is larger than the first, the "OUT OF MEMORY" error
	message displays. If you exit QuickBASIC and then bring QuickBASIC up
	again, any attempt to load a program into the environment also
	generates the error message.
	
	If any application invoked after this is larger than QuickBASIC, the
	following error displays: "PROGRAM TOO LARGE TO FIT IN MEMORY." The
	only way to alleviate this situation is to reboot the machine. Exiting
	QuickBASIC and then running QB.EXE again does not eliminate the
	problem.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS and to the QBX.EXE environment
	of Microsoft BASIC PDS Version 7.00.
	
	To work around this problem, invoke the MS-DOS PRINT, MODE, or ASSIGN
	command before running QB.EXE. You should never SHELL to any
	terminate-and-stay-resident (TSR) program (such as the MS-DOS PRINT,
	MODE, or ASSIGN command).
	
	The following code example demonstrates the memory-fragmentation
	problem:
	
	   cls
	   print "start"
	   shell "test.bat"
	   print "done"
	   end
	
	The following is the batch file TEST.BAT:
	
	   mode com1:300,N,8,1,bin
	   mode lpt1:=com1:
