---
layout: page
title: "Q29201: Serial Mouse: &quot;Driver Not Installed--Mouse Not Found&quot; Message"
permalink: /pubs/pc/reference/microsoft/kb/Q29201/
---

	Article: Q29201
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-APR-1988
	
	A "Driver not installed--Mouse not found" error message usually
	pertains to a possible hardware problem.
	   When isolating the source of the problem, first boot from a
	"vanilla" DOS (i.e., no AUTOEXEC.BAT or CONFIG.SYS files), then
	install the mouse driver manually from the Mouse Setup Disk.
	   If the error remains, check your hardware set up for possible
	hardware conflicts or incorrect serial port configuration before
	determining if you have a possible faulty mouse.
	    Your serial ports must follow an IBM standard and be configured as
	follows:
	
	COM1 using IRQ4 and configured as DTE (data terminal equipment).
	COM2 using IRQ3 and configured as DTE (data terminal equipment).
	
	   The serial mouse does not work on serial ports configured as COM3
	or COM4. If you have only one serial port and it is configured as
	COM2, the mouse driver usually installs but does not work. Configure
	the port as COM1.
	   If you have checked your configuration and the mouse driver does
	not install, checking the mouse on two machines is a good isolation
	test.
