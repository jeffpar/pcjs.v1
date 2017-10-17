---
layout: page
title: "Q44751: QuickC 2.00 Debugger Does Not Debug Overlays"
permalink: /pubs/pc/reference/microsoft/kb/Q44751/
---

## Q44751: QuickC 2.00 Debugger Does Not Debug Overlays

	Article: Q44751
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	The QuickC (QC) Version 2.00 debugger does not support the debugging
	of overlaid executables. If you need to debug a program with overlays,
	use the Microsoft CodeView debugger, Version 2.20 or later. If
	overlays are required because of memory constraints, you should not
	use the QC environment due to the large amount of memory which
	the QuickC enviroment consumes.
