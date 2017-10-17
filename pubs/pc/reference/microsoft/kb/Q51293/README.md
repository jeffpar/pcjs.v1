---
layout: page
title: "Q51293: BASIC Program to Tell If Expanded Memory Driver Is Resident"
permalink: /pubs/pc/reference/microsoft/kb/Q51293/
---

## Q51293: BASIC Program to Tell If Expanded Memory Driver Is Resident

	Article: Q51293
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 26-FEB-1990
	
	The following program shows how to determine if an expanded memory
	driver [or Expanded Memory Manager (EMM)] is loaded under MS-DOS. This
	program can be used either in the QuickBASIC editor or in an .EXE
	program created with the BC.EXE BASIC compiler under MS-DOS. This
	program also determines the amount of available expanded memory and
	the Lotus/Intel/Microsoft (LIM) specification version number of the
	EMS (Expanded Memory Specification) driver. For more information,
	refer to Pages 204-206 in "Advanced MS-DOS Programming, 2nd Edition"
	by Ray Duncan (Microsoft Press, 1988).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	Note that Microsoft BASIC PDS 7.00 introduces support for LIM 4.0 EMS
	(Expanded Memory Specification) for the following features: ISAM file
	buffers, the QBX.EXE editor environment, and LINK overlays at run
	time. Microsoft BASIC Compiler Versions 6.00b and earlier and
	QuickBASIC Versions 4.50 and earlier don't support expanded memory,
	ISAM, or LINK overlays.
	
	If an EMM driver is loaded, it is hooked to Interrupt 67 hex. This
	means that the address stored in the interrupt vector table for
	interrupt 67 hex points to the beginning of the driver. The device
	name for an Expanded Memory Manager driver must be "EMMXXXX0". This
	device name is located 0A hex bytes into the device header. This name
	can be checked to determine if a legitimate driver has been loaded. If
	this name is not found, you can assume that no expanded memory support
	is available.
	
	The strategy used in the program below is to use the DOS service
	(Interrupt 21 hex, function 35 hex) to get the address of the driver
	and then check the driver header found at that address for the correct
	name. Once the program determines that an expanded memory driver is
	available, it can access the driver through interrupt 67 hex, with
	functions 42 hex and 46 hex, to obtain the amount of expanded memory
	and LIM version numbers, respectively. The code example below
	illustrates one method for accomplishing this in Microsoft BASIC.
	
	For more information about how to use INTERRUPT or INTERRUPTX to
	access a DOS interrupt, ROM BIOS interrupt, or any other interrupt
	service, query for a separate article with the following word: QB4INT
	
	For more information about the interrupts necessary to access LIM EMS,
	see Pages 25-68 of "MS-DOS Extensions: Programmer's Quick Reference,"
	by Ray Duncan (Microsoft Press, 1989).
	
	Sample Program
	--------------
	
	'----------------------------- EXPCHK.BAS --------------------------
	'
	'   This program determines if an Expanded Memory Driver is loaded,
	'   displays the amount of available expanded memory, raw page
	'   size, EMM driver status, and the version number of the
	'   Lotus/Intel/Microsoft Expanded Memory Specification.
	
	'$INCLUDE: ''QBX.BI'              'Data Declarations for CALL INTERRUPT(X)
	DIM InRegsx AS RegTypeX, OutRegsx AS RegTypeX
	DIM InRegs AS RegType, OutRegs AS RegType
	DIM buffer(0 TO 4) AS INTEGER
	CLS
	LOCATE 10
	'-------------------------------------------------------------------
	'The Expanded Memory Manager is accessed through Interrupt &H67 if
	'present. Use the DOS Get Interrupt Vector (interrupt 21 hex, with
	'function 35 hex) service to retrieve the address of the device
	'driver and then get the device name from there. If the name is found
	'to be "EMMXXXX0", then the driver is loaded and calls can be made to
	'it.
	'-------------------------------------------------------------------
	
	InRegsx.ax = &H3500 + &H67         'DOS Get Interrupt Address Service
	InRegsx.ds = -1                    'Retain current DS and ES values
	InRegsx.es = -1
	CALL INTERRUPTX(&H21, InRegsx, OutRegsx)
	EMMDriverSEG = OutRegsx.es         'Segment of INT 67 EMM driver
	EMMDriverOFF = OutRegsx.bx         'Offset  of INT 67 EMM driver
	
	DEF SEG = EMMDriverSEG
	index = &HA   'Driver name located at offset &H0A into device header
	DO UNTIL LEN(EMMName$) > 7         'Retrieve Device Name (8 chars)
	        EMMName$ = EMMName$ + CHR$(PEEK(index))
	        index = index + 1
	LOOP
	
	IF EMMName$ = "EMMXXXX0" THEN
	        PRINT TAB(10); "Expanded Memory Available"
	ELSE
	        PRINT TAB(10); "No Expanded Memory Driver Loaded"
	        END
	END IF
	
	InRegs.ax = &H4000                'EMM get status function
	CALL INTERRUPT(&H67, InRegs, OutRegs)
	
	IF OutRegs.ax < 0 THEN            'Isolate high byte of AX
	        highbyte = (OutRegs.ax + 2 ^ 16) \ 256&   'High bit set case
	ELSE
	        highbyte = OutRegs.ax \ 256&
	END IF
	
	IF highbyte = 0 THEN          'Check for error codes in AH
	        PRINT TAB(10); "Extended Memory Driver Status: FUNCTIONAL"
	ELSE
	        PRINT TAB(10); "Extended Memory Driver Status: NON-FUNCTIONAL"
	        PRINT TAB(10); "Error Code: "; OutRegs.ax
	END IF
	
	InRegs.ax = &H4600                        'EMM get version function
	CALL INTERRUPT(&H67, InRegs, OutRegs)
	LimVersion$=LEFT$(HEX$(OutRegs.ax),1) + "." + RIGHT$(HEX$(OutRegs.ax),1)
	PRINT TAB(10); "LIM Version "; LimVersion$; " Driver Installed"
	
	InRegs.ax = &H4200                  'EMM get number of pages function
	CALL INTERRUPT(&H67, InRegs, OutRegs)
	
	IF OutRegs.ax < 0 THEN                      'Isolate high byte of AX
	        highbyte = (OutRegs.ax + 2 ^ 16) \ 256&
	ELSE
	        highbyte = OutRegs.ax \ 256&
	END IF
	
	IF highbyte = 0 THEN
	        PRINT TAB(10); "Total Number of 16K Pages Available: "; OutRegs.dx
	        total& = OutRegs.dx * 16 * 1024& \ 1048576  'Convert to Megabytes
	        PRINT TAB(10); "Total Expanded Memory: "; total&; " Megabytes"
	ELSE
	        PRINT TAB(10); "Error Determining Number of Expanded Memory Pages"
	        PRINT TAB(10); "Error Code: "; OutRegs.ax
	END IF
	
	DEF SEG                                'Restore original state
	IF VAL(LimVersion$) >= 4! THEN  'This only supported LIM 4.0 and later
	   InRegsx.ax = &H5900  'EMM Get hardware config (Page Size) function
	   InRegsx.es = VARSEG(buffer(0))
	   InRegsx.di = VARPTR(buffer(0))
	   CALL INTERRUPTX(&H67, InRegsx, OutRegsx)
	   IF OutRegsx.ax < 0 THEN
	      highbyte = (OutRegsx.ax + 2 ^ 16) \ 256&
	   ELSE
	      highbyte = OutRegsx.ax \ 256&
	   END IF
	
	   IF highbyte = 0 THEN
	      size = buffer(0) * 16& \ 1024  'Convert paragraphs to Kilobytes
	      PRINT TAB(10); "Raw Expanded Memory Page Size: "; size; " Kilobytes"
	   ELSE
	      PRINT TAB(10); "Error in determining Raw Page Size."
	      PRINT TAB(10); "Error Code: "; OutRegsx.ax
	   END IF
	ELSE
	   PRINT TAB(10); "Raw Expanded Memory Page Size: 16 Kilobytes"
	END IF
	
	END
