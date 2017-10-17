---
layout: page
title: "Q43899: Floating-Point Errors in QB.EXE with Coprocessor; Use SET NO87"
permalink: /pubs/pc/reference/microsoft/kb/Q43899/
---

## Q43899: Floating-Point Errors in QB.EXE with Coprocessor; Use SET NO87

	Article: Q43899
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890419-109 B_BasicCom
	Last Modified: 15-DEC-1989
	
	When floating-point errors occur while a program is running in either
	the QuickBASIC environment or as a compiled .EXE file, and the machine
	is equipped with a math coprocessor, the problem may be due to the
	configuration of the math coprocessor.
	
	Math coprocessor problems can be identified by testing QuickBASIC with
	the coprocessor disabled. To disable the coprocessor, SET the NO87
	environment variable at the MS-DOS command prompt. This action must be
	performed before QuickBASIC is invoked and not with a SHELL from the
	editor. The MS-DOS command is as follows:
	
	   SET NO87=Coprocessor is Disabled for QuickBASIC
	
	This command disables the coprocessor for QuickBASIC. The string,
	"Coprocessor is Disabled for QuickBASIC," may be any string with one
	or more characters. If no characters follow the SET NO87= command, the
	coprocessor is turned back on.
	
	If the errors no longer occur after SETting the NO87 variable, then
	the coprocessor should be checked for correct installation and
	configuration.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00.
