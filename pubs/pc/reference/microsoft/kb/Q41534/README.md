---
layout: page
title: "Q41534: ON KEY (n) GOSUB Cannot Trap for SCROLL LOCK Status; Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q41534/
---

## Q41534: ON KEY (n) GOSUB Cannot Trap for SCROLL LOCK Status; Ignored

	Article: Q41534
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI SR# S890216-167
	Last Modified: 14-DEC-1989
	
	It is not possible to use the keyboard flag of the KEY statement to
	check the status of the SCROLL LOCK key in conjunction with
	user-defined keys. The status of the SCROLL LOCK key (on or off) is
	ignored and does not affect trapping of any other keys (with ON KEY
	(n) GOSUB).
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2
	   and MS-DOS
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	4. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
