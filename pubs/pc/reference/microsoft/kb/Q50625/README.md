---
layout: page
title: "Q50625: OS/2 Program Selector Fails to Show DOS Box If Using SCREEN 3"
permalink: /pubs/pc/reference/microsoft/kb/Q50625/
---

## Q50625: OS/2 Program Selector Fails to Show DOS Box If Using SCREEN 3

	Article: Q50625
	Version(s): 6.00 6.00b | 6.00 6.00b
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | SR# S891010-116 B_QuickBas
	Last Modified: 15-DEC-1989
	
	The Program Selector of OS/2 Version 1.00 or 1.10 can't correctly
	switch to the screen of a running BASIC application that is currently
	using SCREEN 3 (Hercules graphics) in the DOS 3.x box (real mode). To
	work around this OS/2 limitation, you must stop the BASIC program with
	CTRL+BREAK or switch back to SCREEN 0 (or text mode) within the
	program.
	
	This behavior occurs in Microsoft QuickBASIC Versions 4.00, 4.00b, and
	4.50 for MS-DOS, in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and in Microsoft BASIC PDS 7.00 for MS-DOS
	and MS OS/2.
	
	The Program Selector of OS/2 Version 1.00 or 1.10 is a simple
	interface that runs in character mode. When you invoke the OS/2 DOS
	box when it is running a program in Hercules graphics mode, OS/2
	maintains character mode and can't refresh the Hercules screen.
	QuickBASIC thinks it is still running under SCREEN 3 and the output is
	incorrect. Text mode must be reinvoked to restore visibility in the
	DOS box.
	
	Note that this problem does not occur for non-Hercules graphics screen
	modes (CGA, EGA, VGA) or for the Task Manager of OS/2 Presentation
	Manager (which can't run on Hercules graphics cards anyway).
	
	When you choose MS-DOS Command Prompt from the Switch To A Running
	Program menu in the OS/2 1.10 Program Selector screen and press ENTER,
	the highlighting on the menu selection disappears, the mouse pointer
	(if any) disappears, and the Program Selector appears to be hung
	(frozen) on the screen. If the BASIC program in the DOS box scrolls
	the screen during this time, the Program Selector will scroll upward
	showing some BASIC output, but the display will be incorrect
	(garbage).
	
	To stop the apparent hang or garbage on the screen, press CTRL+BREAK
	to abort the BASIC program and switch the screen over to text mode,
	thus making the DOS box visible. You can also press CTRL+ESC or
	ALT+ESC to go back to OS/2 at any time.
	
	Example
	-------
	
	To duplicate the problem, invoke the OS/2 Program Selector (CTRL+ESC),
	and then select MS-DOS Command Prompt from the Switch To A Running
	Program menu. Run the following code in the QuickBASIC QB.EXE editor
	or in a compiled .EXE program:
	
	   SCREEN 3
	   PRINT "This is a test"
	   idle: GOTO idle
	
	[You must compile the .EXE program with /D (debug) so that CTRL+BREAK
	can stop the continuous loop in the program.] Invoke the OS/2 Program
	Selector (CTRL+ESC), and then select MS-DOS Command Prompt again. The
	menu highlight will disappear and the Program Selector screen will
	remain intact. The system will appear to be hung, but you are actually
	in the BASIC program. Pressing CTRL+BREAK will stop execution of the
	BASIC program and switch the DOS box back to text mode. When this is
	done, the Program Selector screen will be replaced with the DOS box
	screen.
	
	Note that if the BASIC application is not provided with a means to
	terminate or switch to the text mode screen, then the DOS box (for all
	practical purposes) will be hung. Technically, it can still be
	accessed by the keyboard, but the screen is never displayed correctly
	unless the program itself reinvokes SCREEN 0. The only way out of this
	condition is to reboot the computer.
