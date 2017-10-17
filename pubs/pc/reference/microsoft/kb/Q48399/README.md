---
layout: page
title: "Q48399: Why QuickBASIC Is Incompatible with Many TSR Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q48399/
---

## Q48399: Why QuickBASIC Is Incompatible with Many TSR Programs

	Article: Q48399
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890801-3 B_BasicCom
	Last Modified: 13-DEC-1989
	
	This article summarizes Microsoft's response to the question of why
	many TSR (terminate and stay resident) programs are incompatible with
	Microsoft QuickBASIC for the IBM Personal Computers and compatibles.
	
	For similar information regarding hardware incompatibility, query
	on the following words:
	
	   incompatible and video and hardware and QuickBASIC
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC Compiler 6.00, and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS 7.00 for MS-DOS and
	OS/2.
	
	The QuickBASIC environment is a highly sophisticated development tool
	tuned for simultaneous usability, speedy performance, and efficient
	size, insuring a maximally responsive environment while retaining
	capacity. One technique used to achieve this goal was to hand code the
	majority of the speed-critical areas in assembly language, including
	all parts of the language engine and I/O support. Our constant aim is
	to create program development environments that are unmatched in the
	areas of responsiveness and programmer productivity. The alternative
	is to have a text editor environment capable of spawning off what are
	fundamentally command-line tools.
	
	The result of this challenging objective is a dynamic technical
	accomplishment -- the QuickBASIC environment allows you to climb
	inside the language "engine" and vary the execution paths, manipulate
	your data, and edit and test your source code all without recompiling.
	If QuickBASIC is ill-behaved when TSR software is also present, it's
	the sort of behavior that hundreds of thousands of QuickBASIC
	programmers have decided is well worth the cost for the benefits it
	delivers.
	
	The conflict with TSR software is difficult to avoid in the
	ultrasophisticated low-level technology of QuickBASIC's magnitude.
	While we make every effort to retain TSR and hardware compatibility,
	we are faced with the challenge of identifying those configurations
	that are important enough to support with added code (thus sacrificing
	environment capacity), while trying to retain the maximum speed and
	work space that the majority of users, not using that specific
	configuration, not only appreciate but demand.
	
	The alternative for people who want environments that do not take over
	the machine is the more traditional and less responsive text editor or
	command-line compiler programming technique, which is certainly
	available to all QuickBASIC owners. But for those who appreciate the
	unique advantages of BASIC in its instant environment and do not want
	to trade productivity for low-level machine control, QuickBASIC is
	available for them. And for many people, this is a very reasonable and
	acceptable trade-off.
