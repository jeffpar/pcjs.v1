---
layout: page
title: "Q41087: Mouse and Lotus 1-2-3 Mouse Menu Under Windows/286"
permalink: /pubs/pc/reference/microsoft/kb/Q41087/
---

	Article: Q41087
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-MAR-1989
	
	To run Lotus 1-2-3 and the Mouse Menu for Lotus under Windows, the
	123.PIF file included with Windows must be edited. The key point to
	note is that under the "Directly Modifies" option of the PIF file the
	check boxes for both Screen and Memory must be turned on. Add any
	parameters or set the initial directory if necessary. Save these
	changes so you will not have to repeat them again.
	
	After the 123.PIF file is correctly configured, load the Mouse and
	Menu in memory as you normally would before going into Lotus 1-2-3.
	Bring up Lotus 1-2-3 within Windows and the Menu should function
	correctly. If not, reboot the system from the original floppy DOS disk
	to make sure nothing else in memory is interfering, then load the
	mouse and menu into memory.
