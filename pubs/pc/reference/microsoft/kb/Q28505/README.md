---
layout: page
title: "Q28505: Mouse Installation with OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q28505/
---

## Q28505: Mouse Installation with OS/2

	Article: Q28505
	Version(s): 1.0
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-APR-1988
	
	OS/2 does not use the mouse driver contained with the Microsoft
	mouse.
	
	   The DOS mouse driver MOUSE.COM or MOUSE.SYS does not load if you
	install OS/2 on a machine unless you have a dual boot option where
	standard DOS is loaded. OS/2 has a custom driver MOUSExxx.SYS which
	will run in the OS/2 protected mode or DOS compatibility box. In
	addition to the OS/2 mouse driver, you should load the POINTDD.SYS and
	EGA.SYS as well. Refer to your OS/2 documentation for further OS/2
	mouse driver details.
