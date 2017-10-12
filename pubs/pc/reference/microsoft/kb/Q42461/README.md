---
layout: page
title: "Q42461: C Function _dos_setdrive Returns "5" Drives in the System"
permalink: /pubs/pc/reference/microsoft/kb/Q42461/
---

	Article: Q42461
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | QuickC
	Last Modified: 17-MAY-1989
	
	Question:
	
	Why does the C function _dos_setdrive always return "5", indicating
	that I have five drives in my system, when in fact I only have two?
	
	Response:
	
	The run-time function _dos_setdrive takes two arguments, as follows:
	
	   void _dos_setdrive (drivenum, drives)
	
	The drives argument indicates the total number of drives in the
	system. This means that it will return the number of possible drives
	in the system. The system call Int 21 function 0x0E that _dos_setdrive
	uses to get this information will return a value of either five drives
	in the system or the drive code corresponding to the LASTDRIVE entry
	in CONFIG.SYS, whichever is greater. Without setting
	lastdrive="character" in your CONFIG.SYS, the default "lastdrive" is
	E, which corresponds to five drives possible. This is why
	_dos_setdrive will return "5" when you do not have five physical
	drives in the system.
	
	For example, the following line in CONFIG.SYS will cause a return of
	26, indicating that 26 drives are present in the system:
	
	   lastdrive=z
	
	Therefore, the function _dos_setdrive is working correctly; it is the
	system call 0x0E that is returning such information.
	
	Note: The above information applies only to DOS Versions 3.x and 4.x.
	Under DOS 2.x, the actual number of drives present in the system will
	be reported.
