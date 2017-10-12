---
layout: page
title: "Q29702: Mouse MREADME.DOC: Single Drive PCs"
permalink: /pubs/pc/reference/microsoft/kb/Q29702/
---

	Article: Q29702
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-JUN-1988
	
	If you have a single-drive PC without a hard disk, you will not be
	able to use the Mouse Setup program (MSETUP) to set up the mouse
	software.
	   MSETUP installs the mouse driver, MOUSE.COM.
	   On a single-drive PC, you must install the mouse driver yourself in
	one of the following two ways:
	
	   Manual Installation:      Copy MOUSE.COM onto the disk you use to
	                             start your computer. You can then load
	                             the mouse driver manually each time you
	                             start your system, by typing "MOUSE" at
	                             the DOS prompt.
	
	   Automatic Installation:   With MOUSE.COM on the disk you use to
	                             start your computer, you can modify your
	                             AUTOEXEC.BAT file so that the mouse
	                             driver is automatically loaded each time
	                             you start your system. Add the line
	                             "MOUSE" to the AUTOEXEC.BAT file to
	                             automatically load MOUSE.COM when you
	                             start your computer.
	
	   For more information on this subject, see the "What the MSETUP
	Program Does" section of the "Microsoft Mouse User's Guide."
