---
layout: page
title: "Q62206: LINK L1083 &quot;Cannot Open Run File&quot; on Novell Network"
permalink: /pubs/pc/reference/microsoft/kb/Q62206/
---

## Q62206: LINK L1083 &quot;Cannot Open Run File&quot; on Novell Network

	Article: Q62206
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900423-82
	Last Modified: 18-OCT-1990
	
	A customer reported that when linking a program in Microsoft BASIC
	Professional Development System (PDS) version 7.00 on a workstation
	running Novell NetWare ELS Level I or Level II, you may get LINKer
	error L1083, "cannot open run file." Another customer reported the
	problem on Novell NetWare Advanced 286 version 2.15. This problem does
	not occur when the network software is not installed, according to the
	customers.
	
	The problem seems to occur only if there already is an .EXE file on
	disk with the same base name as the .OBJ file that was being linked.
	When the old .EXE file is deleted, the LINK command functions
	successfully. Microsoft has not tested or confirmed this information.
	
	Microsoft BASIC PDS 7.00 and 7.10 have not been tested under, and are
	not guaranteed to work under, any version of Novell NetWare.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	The customer encountered this problem on both a workstation and server
	machine with the following configurations:
	
	   286 12-MHz Clone
	   Novell ELS Level 1 version 2.0 A
	   (9/15/87)
	
	or
	
	   Novell ELS Level 2 version 2.15
	   DOS version 3.30
	   Hercules video card
