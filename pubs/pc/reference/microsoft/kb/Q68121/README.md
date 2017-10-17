---
layout: page
title: "Q68121: Checking Game Port with CALL INTERRUPT If STICK &amp; STRIG Fail"
permalink: /pubs/pc/reference/microsoft/kb/Q68121/
---

## Q68121: Checking Game Port with CALL INTERRUPT If STICK &amp; STRIG Fail

	Article: Q68121
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901115-120 B_BasicCom
	Last Modified: 17-JAN-1991
	
	If you are experiencing problems with BASIC's game port (or joystick)
	routines, such as STICK or STRIG, this article provides information
	that may help you to diagnose whether the symptom is the result of a
	ROM BIOS problem. This information applies only if your computer has
	an Intel 80286 or 80386 microprocessor chip.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS; and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS.
	
	The way in which BASIC handles joystick commands (which include the
	STICK function, STRIG function, and STRIG statement) depends on which
	kind of Intel microprocessor chip the computer uses. If the computer
	has an 8086/8088 or 80186/80188 microprocessor, the joystick commands
	talk directly to the hardware without going through the BIOS. If the
	computer has either an Intel 80286 or 80386 microprocessor, the
	joystick commands are handled by going through BIOS interrupt 15 hex.
	Because of errors in some BIOS joystick functions on some computers,
	STICK or STRIG may not work at all, or may not work properly.
	
	If your computer has an Intel 80286 or 80386 microprocessor chip, you
	can use the code example below to determine if the problem you are
	having is ROM BIOS related. The program accesses the game port by
	directly calling INTERRUPT &H15 with function &H84, which is the BIOS
	joystick routine. If the problem still occurs when calling the BIOS
	joystick routine directly, then the problem is with the computer's
	BIOS joystick function and not with BASIC's STICK or STRIG.
	
	To access the BIOS joystick routines, you call interrupt &H15 (21
	decimal). The AH register should contain &H84 (132 decimal) to
	indicate the game port support function.
	
	Register values prior to issuing interrupt &H15 should be:
	
	   AX = &H8400    ' This puts &H84 in the AH register.
	   DX = 0 or 1
	
	If DX = 0, this indicates to "read switch settings." If DX = 1, this
	indicates "read resistive inputs."
	
	Depending on the value of DX when you make the call, different
	parameters will be returned by the interrupt. If DX = 1, then upon
	returning from Interrupt &H15, the registers will contain:
	
	   AX = Port1 x coordinate
	   BX = Port1 y coordinate
	   CX = Port2 x coordinate
	   DX = Port2 y coordinate
	
	If DX = 1, then bits 4 - 7 are used to represent switches. The AX
	register will contain the switch settings in bits 4 through 7. BX, CX,
	and DX will be unchanged.
	
	The following code example shows how to use the CALL INTERRUPT routine
	to directly call the BIOS joystick routines. To compile the program,
	use the following compile and link lines:
	
	   BC joystick.bas ;
	   LINK joystick ,,, QB.LIB ;   [For BASIC PDS 7.x use QBX.LIB ;]
	
	To run this program in the QB.EXE or QBX.EXE environment, invoke QB or
	QBX with the /L option (to load the QB.QLB or QBX.QLB Quick library).
	
	JOYSTICK.BAS
	------------
	
	'This code prints to the screen the values of AX, BX, CX, DX registers
	'when interrupt &H15, function &H84 is called with given values in the
	'DX register. This will allow you to observe the values
	'corresponding to a specific action taken on a given device attached
	'to either of the two game ports supported by an IBM or compatible.
	
	'$INCLUDE 'QB.BI'     ' For BASIC PDS 7.x, use QBX.BI
	DIM inregs AS RegType
	DIM outregs AS RegType
	inregs.ax = &H8400          'puts &H84 in AH register
	DO
	 inregs.dx = 1          '1 - read resistive inputs
	 CALL INTERRUPT(&H15, inregs, outregs)
	 CLS
	 LOCATE 16, 10: PRINT "RESISTIVE INPUTS: (STICK)"
	 LOCATE 19, 20: PRINT "AX","BX","CX","DX"
	 LOCATE 20, 20: PRINT  outregs.ax, outregs.bx, outregs.cx, outregs.dx
	
	 inregs.dx = 0          '0 - read switch settings
	 CALL INTERRUPT(&H15, inregs, outregs)
	 LOCATE 6, 10: PRINT "SWITCH SETTINGS: (TRIGGER)"
	 LOCATE 9, 20: PRINT " AX"
	 LOCATE 10,20: PRINT outregs.ax       'only bits 4 - 7 are important
	LOOP WHILE INKEY$ = ""           'loop till any key is pressed
	END
	
	References:
	
	Note: The INTERRUPT routine is considered an external subroutine by
	the compiler. The routine is located in the files QB.LIB and QB.QLB
	for QuickBASIC 4.x and in QBX.LIB and QBX.QLB in BASIC PDS 7.x.
	Programs that execute a CALL INTERRUPT statement when compiled in the
	QB.EXE editor require the presence of the QB.QLB or QBX.QLB Quick
	library. This means that QB.EXE and QBX.EXE must be invoked with the
	/L option, which automatically loads the correct Quick library.
	
	Compiled programs that execute CALL INTERRUPT must be linked with the
	file QB.LIB or QBX.LIB. More information on the use of CALL INTERRUPT
	can be found under the CALL statement in the language reference manual
	for each BASIC product. For more information on how to use CALL
	INTERRUPT, query on the following words:
	
	   CALL and INTERRUPT and application and note and QuickBASIC
	
	For a description of the dependency of STICK and STRIG on computers
	with certain Intel chips, query on the following:
	
	   STICK and STRIG and BIOS
	
	It may be possible to avoid the BIOS routines altogether by directly
	accessing the game port using get and put functions. (BASIC's INP and
	OUT statements cannot do this because of the speed required to read
	the port.) It may be possible for you to write an assembly subroutine,
	which could be called from BASIC to talk directly to the game port.
	
	Information on programming the game port can be found in the following
	texts:
	
	1. Page 433 of "The Programmer's PC Sourcebook" by Thom Hogan,
	   published by Microsoft Press, 1988
	
	2. "IBM Technical Reference Options and Adapters" Volume 2, "Game
	   Control Adapter", published by IBM
