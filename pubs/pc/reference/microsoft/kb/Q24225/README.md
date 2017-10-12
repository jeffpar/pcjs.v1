---
layout: page
title: "Q24225: The Difference Among Watch, Watchpoint, and Tracepoint"
permalink: /pubs/pc/reference/microsoft/kb/Q24225/
---

	Article: Q24225
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER |
	Last Modified: 14-AUG-1989
	
	Question:
	
	What is the difference between a watch, a watchpoint, and a
	tracepoint?
	
	Response:
	
	A "watch" command will monitor an expression or a range of memory
	addresses, and update the watch window each time the expression or any
	location in the range changes. Using a watch never will cause program
	execution to stop; it simply "watches" unconditionally.
	
	A "watchpoint" monitors an expression (and an expression only) during
	program execution. It will update its value in the watch window
	whenever it changes. However, when the watchpoint expression becomes
	true (nonzero), program execution is stopped.
	
	A "tracepoint" monitors an expression or a range of memory addresses
	and displays the expression or the range being monitored in the watch
	window. It will stop program execution when the expression or any
	location in the range changes. Please note that writing over the old
	value at a memory location with the same value is not considered a
	change.
	
	The following example summarizes this information:
	
	Command     Object To Watch          Conditionally    Condition To
	                                     Stops            Stop On
	-------     ---------------          -------------    ------------
	
	WATCH       expression or            No               (none)
	            range of memory
	
	WATCHPOINT  expression               Yes             expression becomes
	                                                     true (nonzero)
	
	TRACEPOINT  expression or            Yes             expression or
	            range of memory                          in range changes
	                                                     location
	
	Note: the "monitoring" described above is done in only window mode. If
	sequential mode is being used, you must use the Watch List command to
	see the values of any of the three types of watch statements.
