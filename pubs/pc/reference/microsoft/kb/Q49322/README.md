---
layout: page
title: "Q49322: MASM Linker Err Msg: L1083: Cannot Open Run File Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q49322/
---

## Q49322: MASM Linker Err Msg: L1083: Cannot Open Run File Under OS/2

	Article: Q49322
	Version(s): 5.10a
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	When linking a Macro Assembler program that is currently running in
	another session, the linker returns the following error:
	
	   L1083 CANNOT OPEN RUN FILE
	
	This error disappears when the program that is running is closed.
	
	This error occurs because OS/2 may want to discard the program's code
	segment and reload it later. If the linker writes a new EXE file and
	OS/2 reloads the code segment, it will be different and cause the
	accompanying problems.
