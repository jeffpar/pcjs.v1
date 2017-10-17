---
layout: page
title: "Q44329: QuickC: Unresolved _main in dos&#92;crt0.asm"
permalink: /pubs/pc/reference/microsoft/kb/Q44329/
---

## Q44329: QuickC: Unresolved _main in dos&#92;crt0.asm

	Article: Q44329
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	If you attempt to compile source code from the help window without
	copying it into the working window, you will get an unresolved
	external on _main in dos\crt0.asm. This error occurs because the
	compiler start-up code calls _main. The linker generates this error
	because there is no program (and hence no main function) in the
	working window. To correct this problem, make sure to copy the source
	FROM the help window TO the working window.
