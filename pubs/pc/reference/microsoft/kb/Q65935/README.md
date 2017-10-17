---
layout: page
title: "Q65935: Explanation of Why BASIC Programs Can Open Devices As Files"
permalink: /pubs/pc/reference/microsoft/kb/Q65935/
---

## Q65935: Explanation of Why BASIC Programs Can Open Devices As Files

	Article: Q65935
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900817-47 B_BasicCom
	Last Modified: 19-OCT-1990
	
	This article explains how Microsoft BASIC compilers, QuickBASIC, and
	GW-BASIC can open character device drivers as if they were files, as
	in the following line of code:
	
	   OPEN "\DEV\CON" FOR OUTPUT AS #1
	
	BASIC can interact with character device drivers in this way because
	this feature is built into MS-DOS.
	
	This information applies to Microsoft QuickBASIC versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS; to Microsoft BASIC
	Professional Development System (PDS) 7.00 and 7.10 for MS-DOS; and to
	all versions of GW-BASIC (3.23, 3.22, 3.20 and earlier) for MS-DOS.
	
	DOS supports two types of device drivers: character device drivers and
	block device drivers. Character device drivers drive those devices
	that input and output data one character at a time. A typical
	character device is the keyboard or the line printer.
	
	DOS provides the ability to open the character device driver for I/O;
	you can access the driver by name as if it were a file. The name can
	be up to eight characters in length. This "name" is internal to the
	device driver and is unrelated to the actual piece of hardware you are
	interacting with. DOS keeps a list internally of the names of
	character device drivers installed at boot time plus some default
	devices that are always present.
	
	DOS provides several character device drivers by default. Any program
	can open CON (the console), AUX (the communications port), PRN (the
	line printer), and LPT1 or LPT2. For example, when you install
	ANSI.SYS, this device driver replaces the default DOS CON device
	driver; therefore, anything printed to the CON device will actually be
	filtered by ANSI.SYS.
	
	For an example of sending escape codes to ANSI.SYS in BASIC through
	the CON device, search for a separate article in this Knowledge Base
	using the following words:
	
	   ANSI and ESCAPE and CON and QUICKBASIC
	
	Some character device drivers can interact with your program by
	sending and receiving control data strings. BASIC provides the IOCTL$
	function and the IOCTL statement to input and output data control
	strings to character device drivers.
	
	Note: Very few device drivers support IOCTL data control strings.
	BASIC's IOCTL and IOCTL$ work correctly only with device drivers that
	have this ability built in.
	
	For more information on device drivers, consult a book on programming
	DOS such as "Advanced MS-DOS Programming, Second Edition" by Ray
	Duncan, published by Microsoft Press (1988).
