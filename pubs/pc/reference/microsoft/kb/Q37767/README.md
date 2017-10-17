---
layout: page
title: "Q37767: BRUNxx.EXE Run-Time Module Must Reload from Disk After SHELL"
permalink: /pubs/pc/reference/microsoft/kb/Q37767/
---

## Q37767: BRUNxx.EXE Run-Time Module Must Reload from Disk After SHELL

	Article: Q37767
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# G881101-5556 B_QuickBas
	Last Modified: 1-FEB-1990
	
	When the SHELL statement is executed, some portions of the BASIC
	run-time module (BRUNxx.EXE) are unloaded. This is done to free up as
	much memory as possible for COMMAND.COM. When the SHELL is complete,
	the run-time module must be reloaded.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2, and to Microsoft
	QuickBASIC Compiler Versions 4.00, 4.00b, 4.50 and earlier for MS-DOS.
	
	If the run-time module is located on a floppy disk removed during the
	SHELL statement, it must be re-inserted before the BASIC program can
	continue. If the program cannot find the run-time module, it will
	prompt you for its location.
	
	To avoid the need to reload the run-time module after SHELL, you can
	compile with the /O (stand alone) option, which includes the run-time
	routines into the BASIC .EXE program at LINK time.
