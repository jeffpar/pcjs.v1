---
layout: page
title: "Q33117: Mouse and IBM Page Printer Hang System"
permalink: /pubs/pc/reference/microsoft/kb/Q33117/
---

## Q33117: Mouse and IBM Page Printer Hang System

	Article: Q33117
	Version(s): 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 4-AUG-1988
	
	When using the Microsoft Mouse with an IBM Page Printer, the mouse
	driver must use MOUSE.SYS rather than MOUSE.COM. To use the mouse with
	an IBM Page Printer, do the following:
	
	   1. Copy MOUSE.SYS from the Setup/Basic Menus disk to the MOUSE1
	      subdirectory of your hard drive.
	   2. Edit your AUTOEXEC.BAT file (found in the root directory) and
	      remove the following line:
	
	      /MOUSE1/MOUSE
	
	   3. Edit your CONFIG.SYS file (also found in the root directory) and
	      insert the following line prior to the line that loads the Page
	      Printer driver:
	
	      DEVICE=C:\MOUSE1\MOUSE.SYS
	
	   4. Reboot the machine. The mouse now can be used in conjunction
	      with the Page Printer.
