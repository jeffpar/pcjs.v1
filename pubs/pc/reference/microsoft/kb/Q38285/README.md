---
layout: page
title: "Q38285: Detecting Presence of 80x87 Math Coprocessor"
permalink: /pubs/pc/reference/microsoft/kb/Q38285/
---

## Q38285: Detecting Presence of 80x87 Math Coprocessor

	Article: Q38285
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | SR# G881027-5369 8087 80287 80387 87 /FPc
	Last Modified: 30-NOV-1988
	
	Question:
	
	My Microsoft C program is compiled with the /FPi (floating-point
	emulator) option. I would like to warn the user if they are running it
	on a machine that has no math coprocessor. Is there any way to detect
	if an 80x87 is currently being used by the floating-point libraries?
	
	Response:
	
	There is no direct way to query the Microsoft C floating-point
	libraries as to whether or not they're using a math coprocessor. If
	you compile /FPi, you're telling the compiler you don't want to have
	to worry about whether or not a coprocessor is present. Consequently,
	the compiler generates code that will do the following:
	
	1. Check to see if a 80x87 coprocessor is present.
	
	2. If so, use it.
	
	3. If not, emulate it with software routines.
	
	There is nothing in this algorithm to tell your program what it found.
	The only way you'll know it's emulating the coprocessor is by
	observing how slowly your program runs.
	
	If you really need to know whether a coprocessor is present, you'll
	have to test it yourself. For more information on how to test for the
	presence of an 80x87 coprocessor, please consult Intel's "80286 and
	80287 Programmer's Reference Manual," Pages 3-2 and 3-3 (in the 2nd
	half of the book). This section is titled "System-Level Numeric
	Programming," and states that your program can detect the presence of
	the 80287 NPX. It then gives an assembly-language example that works
	correctly for both 8086- and 80286-based machines.
	
	Here is how you could use this routine in your program:
	
	1. During initialization of your program, call the short Intel routine
	   to see if a coprocessor is present.
	
	2. If there is a coprocessor, proceed normally.
	
	3. If there is no coprocessor, put up a message box explaining the
	   following to the user:
	
	   "Your computer lacks a coprocessor, but <my_app> will emulate it in
	   software; this emulation will slow down the calculations that
	   <my_app> needs to perform. To increase the performance of
	   <my_app>, as well as other programs, add a numeric coprocessor to
	   your system."
	
	4. Proceed with your program as you normally would. The C run-time
	   libraries will automatically adjust for the presence or lack of a
	   80x87.
