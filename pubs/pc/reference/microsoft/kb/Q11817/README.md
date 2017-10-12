---
layout: page
title: "Q11817: How Interrupts Are Handled in CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q11817/
---

	Article: Q11817
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER | TAR55548
	Last Modified: 9-AUG-1989
	
	Question:
	
	How does CodeView handle interrupt vectors? Does it mask any
	interrupts when it runs?
	
	Response:
	
	CodeView saves and restores about 60 interrupt vectors as a safety
	feature. However, it only redirects the following nine vectors for its
	own use:
	
	   0       Divide By 0
	   1       Single Step
	   2       NMI
	   3       Breakpoint
	   9       Keyboard
	   21H     DOS functions
	   22H     DOS terminate
	   23H     ^C
	   24H     Critical Error
	
	The remaining estimated 51 vectors are never altered by CodeView
	unless something else (e.g. the program being debugged) alters them
	after CodeView has started up. In this case, CodeView restores them to
	their original value as it exits.
	
	When you enter G(o) and let your program run, CodeView relinquishes
	control and lets all interrupts (except the nine listed above) flow
	into your application for processing. However, when you hit a
	breakpoint, the 8259 Programmable Interrupt Controller is masked. This
	prevents interrupts from coming into your application while your
	program is suspended. If you enter G(o) again, CodeView reenables
	interrupts to your application.
	
	To avoid a bug in the 8086 family, CodeView masks the interrupt
	controller during T(race) commands and some P(rogram step) commands.
	CodeView Versions 2.00 and above solve this restriction by emulating
	the interrupts for your application.
	
	You normally do not single-step or trace real-time code, so this
	should not be a problem for developers writing interrupt-driven code.
	However, it is something you should be aware of if you are depending
	on interrupts to get to your application. For example, it will not
	work if you enter "T 1000" and expect your program to catch and
	process interrupts during the trace. You will need to set a breakpoint
	at the instruction with which you are concerned, then enter G(o).
