---
layout: page
title: "Q39853: Networks Supported by QuickBASIC, BASIC Compiler &amp; BASIC PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q39853/
---

## Q39853: Networks Supported by QuickBASIC, BASIC Compiler &amp; BASIC PDS

	Article: Q39853
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881220-65
	Last Modified: 31-JAN-1990
	
	Microsoft QuickBASIC Versions 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50
	for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and OS/2 support only the IBM
	PC-NET and MS-NET compatible networks.
	
	The above versions of QuickBASIC, BASIC compiler, and BASIC PDS have
	NOT been tested by Microsoft on the following networks:
	
	   Token Ring
	   Novell
	 * LAN Manager
	   3COM Net
	   Alloy
	
	* Note: This is not Microsoft LAN Manager, but is a product of another
	        company.
	
	Even though varying degrees of success have been reported using some
	of these non-Microsoft networks, problems may occur, such as the
	inability to lock individual records, or permission-denied errors when
	an application attempts to open an unlocked file.
	
	To troubleshoot problems with non-Microsoft networks, you must  find
	out the version number of the network software, the version of the
	network card, the exact circumstances and programs necessary to
	reproduce the problem, and whether the problem occurs on a server or
	workstation. It may help to call the company that sells the network to
	help determine known problems and troubleshooting techniques.
	Unrelated TSR (terminate and stay resident) programs should be removed
	from memory to help isolate the problem.
