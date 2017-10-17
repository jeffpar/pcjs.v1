---
layout: page
title: "Q50700: C Run Time Can't Be Used in DLL Initialization with CRTLIB.DLL"
permalink: /pubs/pc/reference/microsoft/kb/Q50700/
---

## Q50700: C Run Time Can't Be Used in DLL Initialization with CRTLIB.DLL

	Article: Q50700
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G891005-116
	Last Modified: 30-NOV-1989
	
	Question:
	
	I am writing a DLL with a start-up routine written in C.
	
	The start-up routine is getting a protection violation within a
	sprintf call (the first call to a C run-time function).
	
	Can the start-up routine call the C Run Time Library?  Why is this
	bombing?
	
	This works correctly if I link the .DLL with LLIBCDLL.LIB and use the
	appropriate .OBJ files.
	
	Response:
	
	In general, you cannot call the run time library from a multithreaded
	.DLL initialization routine (one that uses CRTLIB.DLL).
	
	The reason is that C_INIT() doesn't completely initialize CRTLIB.DLL;
	this is not initialized until the .EXE start-up code is executed.
	
	You still must call C_INIT() from within your .DLL initialization
	routine in order to perform other necessary initializations.
	
	There are two possible workarounds:
	
	1.  Write your own functions to replace sprintf().
	
	2.  Don't use user initialization; instead, call an initialization
	    routine in your .DLL from the beginning of your .EXE. Since
	    your code in your .EXE does not execute until after the .EXE's
	    start-up is executed, CRTLIB.DLL will be initialized by the time
	    you attempt to initialize your .DLL.
