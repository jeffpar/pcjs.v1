---
layout: page
title: "Q22015: SHELL &quot;PATH=&#92;...&quot; Affects Only a Local Copy of DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q22015/
---

## Q22015: SHELL &quot;PATH=&#92;...&quot; Affects Only a Local Copy of DOS

	Article: Q22015
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	SHELLing to the DOS PATH command fails to change the default directory
	search path when you exit QuickBASIC. BASICA Version 3.10 behaves
	similarly.
	
	The following is an example:
	
	   SHELL "PATH=\BASIC"
	
	According to Page 458 of the "Microsoft QuickBASIC Compiler" manual
	for Version 3.00 and Page 396 of the "Microsoft QuickBASIC Version
	4.0: BASIC Language Reference" manual, the SHELL statement allows
	execution of DOS commands such as DIR, PATH, and SORT.
	
	When you invoke a SHELL command from a QuickBASIC program, a local
	copy of COMMAND.COM and the DOS environment is spawned. When paths are
	changed, only the local environment copy is changed, not the original
	DOS environment.
