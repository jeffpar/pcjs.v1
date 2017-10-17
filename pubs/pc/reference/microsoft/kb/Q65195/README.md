---
layout: page
title: "Q65195: Joystick STICK, STRIG Use BIOS Int 15 Hex, or Direct Hardware"
permalink: /pubs/pc/reference/microsoft/kb/Q65195/
---

## Q65195: Joystick STICK, STRIG Use BIOS Int 15 Hex, or Direct Hardware

	Article: Q65195
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900822-65 B_BasicCom
	Last Modified: 17-JAN-1991
	
	The way in which BASIC handles joystick commands, such as the STICK
	function, STRIG function, and STRIG statement, depends on which kind
	of Intel microprocessor chip the computer has.
	
	If the computer has either an Intel 80286 or 80386 microprocessor, the
	joystick commands are handled by going through BIOS interrupt 15 hex.
	If the computer has an 8086/8088 or 80186/80188 microprocessor, the
	joystick commands talk directly to the hardware.
	
	This information applies to Microsoft QuickBASIC versions 3.00, 4.00,
	4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	This difference in joystick handling is due to the fact that the ROM
	BIOS routines for handling the joystick are not reliable on the first
	8088- and 8086-based machines. QB.EXE and programs compiled with
	BC.EXE automatically check what type of processor the machine has and
	use that information to decide whether to go through the BIOS or to go
	directly to the port for the joystick.
	
	This implies that if problems are encountered programming the joystick
	in QuickBASIC on an 80286 or 80386 machine, it is probably due to the
	ROM BIOS functions not working correctly or consistently on that
	machine. On 80286 and 80386 machines, QuickBASIC will make generic
	interrupt 15 hex calls. QuickBASIC should work correctly if the BIOS
	is handling the joystick correctly on 80286 and 80386 machines.
	
	For more information on how to use the CALL INTERRUPT statement to
	invoke BIOS interrupt 15 Hex to help diagnose game port (or joystick)
	problems, query on the following words:
	
	   STRIG and STICK and BIOS
