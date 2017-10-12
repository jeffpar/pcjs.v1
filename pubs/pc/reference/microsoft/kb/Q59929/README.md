---
layout: page
title: "Q59929: MSETUP Deletes Reference to MOUSE.SYS in CONFIG.SYS"
permalink: /pubs/pc/reference/microsoft/kb/Q59929/
---

	Article: Q59929
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 3-APR-1990
	
	The MSETUP program that is supplied with the 400 PPI Mouse (Mouse
	Driver Version 7.00 or later) deletes any reference to MOUSE.SYS in
	the CONFIG.SYS file.
	
	If you are operating under OS/2, do NOT run MSETUP.
	
	MSETUP deletes the MOUSE.SYS reference in CONFIG.SYS to prevent the
	loading of a older version of the mouse driver when the machine is
	booted.
	
	Do not run MSETUP on an OS/2 system, and do not load the DOS mouse
	driver to make the mouse work in the DOS box.
