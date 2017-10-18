---
layout: page
title: "Q30820: MASM 5.10 OS2.DOC: OS/2 Call Summary - Mouse Input"
permalink: /pubs/pc/reference/microsoft/kb/Q30820/
---

## Q30820: MASM 5.10 OS2.DOC: OS/2 Call Summary - Mouse Input

	Article: Q30820
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Mouse input constant - INCL_MOU
	
	   @MouRegister - Registers a mouse subsystem or environment manager
	   Parameters - ModuleName:PZ, EntryName:PZ, Mask:D
	
	   @MouDeRegister - Deregisters a mouse subsystem or environment manager
	   Parameters - None
	
	   @MouFlushQue - Flushes the mouse event queue
	   Parameters - DeviceHandle:W
	
	   @MouGetHotKey - Queries to determine which physical key (button) is the
	                   system hot key
	   Parameters - ButtonMask:PW, DeviceHandle:W
	
	   @MouSetHotKey - Tells the mouse driver which physical key (button) is
	                   the system hot key
	   Parameters - ButtonMask:PW, DeviceHandle:W
	
	   @MouGetPtrPos - Gets the coordinates (row and column) of the mouse pointer
	   Parameters - PtrPos:PS, DeviceHandle:W
	   Structure - PTRLOC
	
	   @MouSetPtrPos - Sets new coordinates for the mouse pointer image
	   Parameters - PtrPos:PS, DeviceHandle:W
	   Structure - PTRLOC
	
	   @MouSetPtrShape - Sets the shape and size for the mouse pointer image
	   Parameters - PtrBuffer:PB, PtrDefRec:PS, DeviceHandle:W
	   Structure - PTRSHAPE
	
	   @MouGetPtrShape - Copies the pointer shape for the screen group
	   Parameters - PtrBuffer:PB, PtrDefRec:PS, DeviceHandle:W
	   Structure - PTRSHAPE
	
	   @MouGetDevStatus - Returns the status flags for the mouse device driver
	   Parameters - DeviceStatus:PW, DeviceHandle:W
	
	   @MouGetNumButtons - Returns the number of buttons
	   Parameters - NumberOfButtons:PW, DeviceHandle:W
	
	   @MouGetNumMickeys - Returns the number of mickeys per centimeter
	   Parameters - NumberOfMickeys:PW, DeviceHandle:W
	
	   @MouReadEventQue - Reads an event from the pointing device event queue
	                      into the mouse event queue
	   Parameters - Event:PS, NoWait:PW, DeviceHandle:W
	   Structure - MOUEVENTINFO
	
	   @MouGetNumQueEl - Returns the status for the event queue
	   Parameters - QueDataRecord:PS, DeviceHandle:W
	   Structure - MOUQUEINFO
	
	   @MouGetEventMask - Returns an event mask for the current pointing device
	   Parameters - EventMask:PW, DeviceHandle:W
	
	   @MouSetEventMask - Assigns a new event mask to the current pointing device
	   Parameters - EventMask:PW, DeviceHandle:W
	
	   @MouGetScaleFact - Gets scaling factors for the current pointing device
	   Parameters - ScaleStruct:PS, DeviceHandle:W
	   Structure - SCALEFACT
	
	   @MouSetScaleFact - Assigns scaling factors for the current pointing device
	   Parameters - ScaleStruct:PS, DeviceHandle:W
	   Structure - SCALEFACT
	
	   @MouOpen - Opens the mouse device for the current screen group
	   Parameters - DriverName:PZ, DeviceHandle:PW
	
	   @MouClose - Closes the mouse device for the current screen group
	   Parameters - DeviceHandle:W
	
	   @MouRemovePtr - Notifies the mouse device driver that a specified area is
	                   for the exclusive use of the application
	   Parameters - PtrArea:PS, DeviceHandle:W
	   Structure - NOPTRRECT
	
	   @MouDrawPtr - Releases an area previously restricted to the pointer
	                 image for use by the mouse device driver
	   Parameters - DeviceHandle:W
	
	   @MouSetDevStatus - Sets the pointing device driver status flags
	   Parameters - DeviceStatus:PW, DeviceHandle:W
	
	   @MouInitReal - Initializes the real-mode mouse device driver
	   Parameters - DriverName:PZ
