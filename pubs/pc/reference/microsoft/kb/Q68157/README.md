---
layout: page
title: "Q68157: Gama Fax TSR Program Conflicts with BASIC Keyboard Input"
permalink: /pubs/pc/reference/microsoft/kb/Q68157/
---

## Q68157: Gama Fax TSR Program Conflicts with BASIC Keyboard Input

	Article: Q68157
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901207-36 B_BasicCom
	Last Modified: 15-JAN-1991
	
	This article gives information about using QuickBASIC version 4.50
	with the software Gama Fax CB version 4.3.1 (latest version as of
	1/1/91). Gama Fax CB is manufactured by the company Gama Link. This
	software operates a fax dispatcher.
	
	Gama Fax CB is a TSR (terminate and stay resident) program that can
	interfere with BASIC's keyboard input in key trapping techniques, such
	as ON KEY GOSUB and INKEY$. The TSR program slows down BASIC's
	keyboard input so that a delay occurs before the input is eventually
	read. An explanation and workaround is provided below.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, 4.50 for MS-DOS; to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS; and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS.
	
	This conflict is due to the operation of the Gama Fax software. Gama
	Fax CB runs as a background task that constantly monitors
	communications port input while other programs (like QuickBASIC
	programs) run in the foreground. This means that the TSR program
	competes for processing time with QuickBASIC.
	
	It is possible to control how much background processing time the Gama
	Fax software will take. By adjusting this time, you may be able to
	correct the problem with BASIC keyboard input. There is a
	configuration file called GFAX.$DC that comes with the Gama Fax
	software. Inside GFAX.$DC is a line with the statement "GFXSHUTDOWN",
	followed by some numbers. After that line, add the following line:
	
	   QUANTUMS number1 number2
	
	This command splits the foreground and background time slices. The
	number1 is the number of time ticks assigned to the foreground process
	(your BASIC program). The number2 is the number of time ticks assigned
	to the background process (the Gama Fax software).
	
	Below are some number combinations that have been successful for other
	Gama Fax users:
	
	   QUANTUMS 4 50
	   QUANTUMS 2 50     <-- most successful
	   QUANTUMS 2 100
	
	Other combinations may work with other machines or other versions of
	QuickBASIC. If the above configuration does not solve the problem and
	you need more assistance in configuring the Gama Fax software, contact
	Gama Link at (408) 744-1430.
