---
layout: page
title: "Q29202: Mouse Driver Installs but Mouse Does Not Work"
permalink: /pubs/pc/reference/microsoft/kb/Q29202/
---

## Q29202: Mouse Driver Installs but Mouse Does Not Work

	Article: Q29202
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 5-JUN-1988
	
	If the mouse driver is installed, but the mouse does not work, the
	problem may be due to one of the following problems:
	
	   1. A hardware conflict
	   2. A software conflict
	   3. A faulty mouse
	
	   If you have a serial mouse, make sure that your serial ports are
	correctly configured.
	   To rule out a software conflict, boot from a "vanilla" DOS (i.e.,
	no AUTOEXEC.BAT or CONFIG.SYS files) and manually install the mouse
	driver from the Mouse Setup disk by typing Mouse.
	   Problems can occur if the mouse driver is installed on a device
	other than the mouse. This is true in cases where a noisy bus causes
	the driver to install for a bus mouse, or a device such as a modem
	causes the driver to think a serial mouse is being used.
	   If you suspect the driver is not installing on the correct port,
	use the mouse switches to direct the driver to the specific port.
	   For example, if your mouse is on COM2, load the mouse driver with
	the following command:
	
	   MOUSE /C2  <- install driver on COM2
	
	   If you have a bus mouse, check the jumper settings for a possible
	interrupt conflict, an I/O address conflict, or expansion slot problems.
	  If the problems continue, isolate the problem on another machine
	before determining if you have a faulty mouse.
