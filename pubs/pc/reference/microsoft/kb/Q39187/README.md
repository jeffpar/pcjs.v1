---
layout: page
title: "Q39187: &quot;Bad File Name&quot; OPENing &quot;COM1:&quot; with 1.5 Stop Bits"
permalink: /pubs/pc/reference/microsoft/kb/Q39187/
---

## Q39187: &quot;Bad File Name&quot; OPENing &quot;COM1:&quot; with 1.5 Stop Bits

	Article: Q39187
	Version(s): 1.00 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881207-9
	Last Modified: 5-SEP-1990
	
	The option for 1.5 stop bits is not supported in any version of
	QuickBASIC (1.00, 1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, or 4.50) or in
	Microsoft BASIC Compiler version 6.00 or 6.00b for MS-DOS and MS OS/2.
	However, 1.5 stop bits is supported in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10.
	
	In QuickBASIC, if you try to open the serial communications port using
	1.5 Stop Bits, you will get a "Bad file name" error when you run the
	program in the QB.EXE editor. This error will not occur with 1.5 stop
	bits in BASIC PDS 7.00 and 7.10.
	
	The following similar error message is returned when you run an .EXE
	file compiled with the BC.EXE environment that comes with QuickBASIC:
	
	   BAD FILE NAME in module $$$ at address xxx:xx
	
	The communications option for 1.5 stop bits is supported by GW-BASIC
	versions 3.20, 3.22, and 3.23.
	
	The following is a code example:
	
	   OPEN "COM1:1200,N,8,1.5" FOR RANDOM AS #1
