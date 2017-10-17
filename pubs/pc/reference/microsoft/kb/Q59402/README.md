---
layout: page
title: "Q59402: QBX &amp; BC /Es Option Shares Expanded Memory with Mixed Language"
permalink: /pubs/pc/reference/microsoft/kb/Q59402/
---

## Q59402: QBX &amp; BC /Es Option Shares Expanded Memory with Mixed Language

	Article: Q59402
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900227-66 docerr
	Last Modified: 8-JAN-1991
	
	This article discusses the /Es (share expanded memory) option for
	QBX.EXE and BC.EXE in Microsoft BASIC Professional Development System
	(PDS) Versions 7.00 and 7.10 for MS-DOS.
	
	The BC /Es Option
	-----------------
	
	The /Es option for BC.EXE needs to be added to the list of BC options
	on Page 559 of the "Microsoft BASIC 7.0: Programmer's Guide" for
	versions 7.00 and 7.10.
	
	The BC /Es option is correctly described on Page 608 of the "Microsoft
	BASIC 7.0: Language Reference" (Appendix C: "Command-Line Tools Quick
	Reference") for 7.00 and 7.10. The BC /Es option is also correctly
	documented as follows in the Microsoft Advisor online Help system in
	QBX.EXE, found by choosing Contents from the Help menu, then selecting
	"BC Command Line":
	
	   "HELP: BC Command Line"
	   /Es       Allows you to share expanded memory between BASIC and
	             mixed-language routine(s) that make use of expanded memory.
	             Specify /Es when you are going to use a mixed-language
	             routine that makes use of expanded memory.
	
	Note: The only way an .EXE program compiled with BC.EXE can use
	expanded memory is with ISAM file buffers, or when linked to use
	overlays, as described in a separate article found with the following
	query:
	
	   how and LINK and overlays and BASIC and 7.00
	
	The QBX /Es Option
	------------------
	
	QBX.EXE, the programming environment included with Microsoft BASIC
	Professional Development System (PDS) Version 7.00, can use expanded
	memory for procedures smaller than 16K.
	
	Note that the QBX /Es option cannot be used together with the /Ea
	option. (The QBX /Ea option lets each non-variable-length string array
	smaller than 16K use one 16K page of expanded memory.)
	
	By invoking QBX with the /Es switch, QBX can share expanded memory
	with mixed-language routines (in Quick libraries) that make DOS
	interrupts to access expanded memory.
	
	The QBX /Es switch is correctly documented on Page 626 of the
	"Microsoft BASIC 7.0: Language Reference," and in the Microsoft
	Advisor online Help system in QBX.EXE, found by choosing Contents from
	the Help menu, then selecting "QBX Command Line":
	
	   "HELP: QBX Command Line"
	   /Es      Allows you to share expanded memory between QBX and
	            Quick libraries or mixed-language routines that make use
	            of expanded memory. Specify /Es when you are using a
	            Quick library or mixed-language routine that makes use
	            of expanded memory. Do not use /Es with the /Ea option.
