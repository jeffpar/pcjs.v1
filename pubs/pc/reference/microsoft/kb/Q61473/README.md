---
layout: page
title: "Q61473: Debugging Large DOS Applications in CodeView 3.0 with /X /E /D"
permalink: /pubs/pc/reference/microsoft/kb/Q61473/
---

	Article: Q61473
	Product: Microsoft C
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-MAY-1990
	
	CodeView version 3.00 includes enhanced support for debugging
	applications under DOS. CodeView 3.00 may access extended memory or
	expanded memory, or the size of the overlay swap area that CodeView
	uses may be adjusted.
	
	CodeView 3.00 offers three command-line parameters (/X, /E, and /D)
	for specifying memory utilization. If you DO NOT specify the /X, /E,
	or /D options when you start a CodeView session, CodeView will
	automatically search for extended memory. If CodeView finds extended
	memory, it will place the symbolic information and most of itself into
	extended memory (as long as enough extended memory is available).
	
	If there is no extended memory on your system, Codeview will search
	for expanded memory. If there is expanded memory, Codeview will place
	the symbolic information for your program in expanded memory.
	
	If there is no extended or expanded memory on your machine, CodeView
	will load itself, your application, and symbolic information for your
	program in base memory.
	
	Since CodeView does this automatic scan for extended and expanded
	memory, the /X and /E switches are needed only if you explicitly want
	to specify the use of one form of memory or the other and you do not
	want to enter CodeView if this memory type is not available.
	
	CodeView's /X option tells the debugger to load into extended memory
	ONLY, and to return an error message if extended memory is not
	available on your system. This message has the following form:
	
	   CV1302 Error: /X : HIMEM.SYS not loaded
	
	CodeView's /E option tells the debugger to access expanded memory
	ONLY, and to return an error message if there is no expanded memory on
	your machine. This message has the following form:
	
	   CV1304 Error: /E : EMM driver not loaded
	
	CodeView's /D option specifies that CodeView should use disk overlays.
	When you use this option, you can also specify a decimal size in
	kilobytes between 16K and 128K to explicitly set the overlay swap area
	size. The default size of the swap area is 64K if /D is used but no
	size is explicitly specified. If extended and expanded memory are not
	available, /D will not need to be specified for the default 64K
	overlay swap area to be used.
	
	A larger overlay swap area allows CodeView to run faster because it
	doesn't have to swap to disk as frequently as with a smaller swap
	area, but it means more memory is used up by CodeView itself. A
	smaller swap area allows you to debug larger applications under DOS,
	but CodeView runs slower because of the more frequent need to swap
	code from disk to memory.
