---
layout: page
title: "Q42802: DOS Redirection and QuickC Environment Command Line"
permalink: /pubs/pc/reference/microsoft/kb/Q42802/
---

	Article: Q42802
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	In Microsoft QuickC Versions 1.00 and 1.01, the command line can be
	entered from the RUN menu, "Set Runtime Options" screen. Version 2.00
	has the command-line screen on the OPTIONS menu, "Run / Debug" screen.
	
	The Microsoft Quick C Versions 1.00, 1.01, and 2.00 integrated
	environments do not allow DOS's "<input.fil >output.fil" redirection
	commands when they are entered in the "enter command line" portion of
	QuickC. They become normal arguments to the application program.
	
	In QuickC 2.00, you can achieve redirection of input and output by
	entering their commands in the "Run DOS command..." screen in the
	UTILITY menu. The disadvantage is the loss of the debugger.
	
	For redirection to be initiated, a new command process must be
	invoked. Since QuickC spawns the application program directly, no new
	COMMAND.COM is loaded. Thus, the redirection commands become arguments
	to the application.
	
	Input and output can be redirected at the execution of QuickC.
	
	For input redirection, the following command will use the contents of
	PROG.IN as the input data for the application:
	
	   qc prog.c <prog.in
	
	The input will be consumed as the program requests input. When the
	input is depleted, subsequent requests for input will not be
	satisfied. Thus, the program waits forever. CTRL+BREAK or CTRL+C will
	take you back to the environment in Versions 1.00 and 1.01. Version
	2.00 does not return control back to the environment.
	
	For Version 2.00, if output is redirected on the invocation of Quick
	C, as in the following example, all of the output from the application
	program, including PROG.EXE, is sent to the file PROG.OUT at the
	beginning; and "Elapsed time 00:00:08.97. Program returned (-1). Press
	any key." is sent at the end:
	
	   qc prog.c >prog.out
	
	Quick C Versions 1.00 and 1.01 will send the string "Program returned
	(-1). Press any key." to the output file after your application has
	completed.
	
	Note: DOS redirection will affect the DOS shell. If input was
	redirected, you will not be able to type "exit" in order to get back to
	QuickC.
