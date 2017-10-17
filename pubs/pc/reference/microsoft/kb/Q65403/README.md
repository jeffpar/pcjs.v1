---
layout: page
title: "Q65403: LINK Creating Temporary File Can Hang on 3Com 3+ Open Network"
permalink: /pubs/pc/reference/microsoft/kb/Q65403/
---

## Q65403: LINK Creating Temporary File Can Hang on 3Com 3+ Open Network

	Article: Q65403
	Version(s): 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900824-163 B_QuickBas
	Last Modified: 4-SEP-1990
	
	A customer reported that when using LINK.EXE version 5.10 (the linker
	that comes with Microsoft BASIC Professional Development System [PDS]
	version 7.10) on a workstation running on a 3Com 3+ Open network, the
	computer may hang if the linker needs to generate a .TMP file.
	
	If you set the TMP environment variable to a directory on the
	workstation's own hard drive, the linker should function correctly.
	
	This information applies to Microsoft BASIC PDS version 7.10 and
	LINK.EXE version 5.10. The problem does not occur when using Microsoft
	BASIC PDS version 7.00 and LINK.EXE version 5.05.
	
	Please note that Microsoft BASIC PDS 7.10 is designed to support only
	the IBM PC-NET and MS-NET compatible networks.
	
	When the linker does not have enough room to work correctly in memory,
	it will write a temporary file to disk and display the message:
	
	   Temporary file .\xxxxxxxx has been created
	
	This customer reported that without a TMP environment variable set,
	the linker attempted to write the temporary file on the server
	machine, which hung his computer. After he added the TMP environment
	variable and assigned it a path to a directory on the workstation's
	own hard drive, the computer did not hang. The TMP environment
	variable can be set by either typing a line such as the following at
	the DOS prompt or by putting it into your AUTOEXEC.BAT file:
	
	   TMP=C:\directory name
	
	The problem only occurred when the workstation was running under DOS.
	While running under OS/2 version 1.20, the problem did not occur.
	
	The customer encountered this problem on a workstation with the
	following configuration:
	
	   386 Clone
	   3Com 3+ Open Network version 1.1e
	   DOS 4.01
