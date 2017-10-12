---
layout: page
title: "Q47989: Resident Software May Cause &quot;Internal Debugger Error 80&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q47989/
---

	Article: Q47989
	Product: Microsoft C
	Version(s): 1.x 2.00 2.10 2.10 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-AUG-1989
	
	Question:
	
	Sometimes when I run CodeView, I get an "Internal Debugger Error 80"
	message. What causes this?
	
	Response:
	
	Internal Debugger Error messages are usually caused by problems in
	your MS-DOS environment; the most likely cause is the presence of
	memory-resident software, commonly referred to as TSRs (terminate-
	and-stay-resident software).
	
	For example, running CodeView with Borland's Sidekick loaded has been
	known to cause "Internal Debugger Error 80" and "R6002: Floating Point
	not loaded" error messages. "Internal Debugger Error 80" has also been
	reported when CodeView was run with Software Solutions' "Software
	Carousel" loaded into memory.
	
	CodeView Versions 2.00 and later have become increasingly more
	sensitive to TSRs. If you receive an Internal Debugger Error message,
	or you are experiencing strange problems within CodeView, make sure
	you are running CodeView with no memory-resident software loaded
	(including, but not limited to, device drivers, screen savers,
	keyboard enhancers, command-line editors, etc.). Disabling your
	resident software, but not rebooting, may not completely remove its
	interference, so be sure to "boot clean" when trying to resolve a
	problem of this type.
	
	If you continue to receive the error message without memory-resident
	programs, try running CodeView on some other program to see if the
	error is related to particular code. If the error is related to the
	specific code, and you are unable to determine the cause, you may want
	to call Microsoft Product Support for assistance at (206) 454-2030.
	
	If the error is not dependent on your code, the problem might be the
	particular sequence of CodeView commands you execute. Make a note of
	what operations you performed, i.e., the sequence of Trace, Go, Watch,
	Tracepoint, etc., commands that were issued, and contact Microsoft
	Product Support via phone, letter, or Microsoft OnLine.
