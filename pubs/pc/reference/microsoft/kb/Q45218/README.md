---
layout: page
title: "Q45218: APPEND Command in DOS 4.x Incompatible with QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q45218/
---

## Q45218: APPEND Command in DOS 4.x Incompatible with QuickC 2.00

	Article: Q45218
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-SEP-1989
	
	MS-DOS Versions 3.30 and 4.00 support an APPEND command that conflicts
	with the QuickC Version 2.00 environment. The DOS Version 4.00
	installation program may insert two APPEND commands in the
	AUTOEXEC.BAT file automatically. The same automatic insertion can
	occur for the DOS Box in OS/2.
	
	The presence of the APPEND command typically causes out-of-memory
	errors such as the following when compiling or linking inside the
	environment:
	
	   ILINK returned -1
	
	   R6005: Not enough memory on Exec
	
	Executing the command "APPEND ;" from the DOS command line may
	disable APPEND; if QuickC still produces errors, then removing APPEND
	entirely may be the only solution.  It will then be necessary to
	reboot for this change to take affect.
