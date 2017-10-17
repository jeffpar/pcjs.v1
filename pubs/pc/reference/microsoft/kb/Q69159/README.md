---
layout: page
title: "Q69159: Example of How to Call BASIC SetUEvent from C; ON UEVENT GOSUB"
permalink: /pubs/pc/reference/microsoft/kb/Q69159/
---

## Q69159: Example of How to Call BASIC SetUEvent from C; ON UEVENT GOSUB

	Article: Q69159
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910107-180 B_QUICKBAS S_C
	Last Modified: 14-FEB-1991
	
	Page 310 of the "Microsoft BASIC 7.0: Programmer's Guide" states:
	
	   Trapping a user-defined event involves writing a non-BASIC
	   routine, such as in Microsoft Macro Assembler (MASM) or C, ....
	
	On the same page, this statement is followed by an example of how to
	set up the ON UEVENT GOSUB routine in assembly language.
	
	This article shows how the same example can be written in the
	Microsoft C language.
	
	The code example below applies to Microsoft QuickBASIC versions 4.00b
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	Compile the C program below with:
	
	   CL -Od -AM -c uevent.c
	
	Compile the BASIC program below with:
	
	   BC /O/V BASIC.BAS;
	
	Link the programs together with:
	
	   LINK /NOE BASIC+UEVENT, UEVENT.EXE;
	
	When the program is executed, the line "Arrived here after 4.5
	seconds" will print every 4.5 seconds.
	
	Note: The C program must be compiled with the medium memory model
	because the DS register must point to BASIC's DGROUP space when
	SetUevent is called.
	
	BASIC Code Example, BASIC.BAS
	-----------------------------
	
	DECLARE SUB SetInt
	DECLARE SUB RestInt
	' Install new interrupt service routine:
	CALL SetInt
	' Set up the BASIC event handler:
	ON UEVENT GOSUB SpecialTask
	UEVENT ON
	
	DO
	' Normal program operation occurs here.
	' Program ends when any key is pressed.
	LOOP UNTIL INKEY$ <> ""
	
	' Restore old interrupt service routine before quitting:
	CALL RestInt
	END
	
	' Program branches here every 4.5 seconds:
	SpecialTask:
	' Code for special task goes here, for example:
	PRINT "Arrived here after 4.5 seconds"
	RETURN
	
	C Code Example, UEVENT.C
	------------------------
	
	#include <dos.h>
	void (_interrupt _far *OldInt) (void);    // The old interrupt vector.
	void _interrupt _far EventHandler (void);       // The UEVENT handler.
	char TimerTicks = 0;                      // Number of ticks elapsed.
	
	void pascal SetInt()                      // Set up the interrupts
	{                                         //   to point to the UEVENT
	    OldInt = _dos_getvect(0x1C);          //    handler.
	    _dos_setvect(0x1C, EventHandler);
	}
	
	void interrupt EventHandler()            // This is the UEVENT handler.
	{
	    extern pascal SetUevent();
	    if (++TimerTicks > 82)               // Check to see if 4.5 secs
	      {                                  //    has elapsed (18.2
	        TimerTicks = 0;                  //    ticks = 1 sec).
	        SetUevent();
	      }
	    _chain_intr(OldInt);                // Continue through old
	}                                       //    interrupt routine.
	
	void pascal RestInt()                   // Restore old interrupt
	{                                       //    when done to avoid
	    _dos_setvect(0x1C, OldInt);         //    conflicts after exit.
	}
