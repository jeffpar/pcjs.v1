---
layout: page
title: "Q51763: C1126 - &lt;Identifier&gt;: Automatic Allocation Exceeds &lt;Size&gt;"
permalink: /pubs/pc/reference/microsoft/kb/Q51763/
---

## Q51763: C1126 - &lt;Identifier&gt;: Automatic Allocation Exceeds &lt;Size&gt;

	Article: Q51763
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 17-JAN-1990
	
	The QuickC Versions 2.00 and 2.01 error
	
	   C1126 - <identifier>: automatic allocation exceeds <size>
	
	is similar to the C2126 error in C 5.10 as well as QuickC 1.0x. In
	each case, it indicates that the space allocated for the local
	variables of a function exceeds the given limit (usually 32K).
	However, in QuickC 2.00 or 2.01, the error is fatal (hence, the C1xxx
	id).
	
	The error is documented in the QuickC 2.00 or 2.01 "Microsoft QuickC
	Tool Kit Version 2.0" manual, Page 232.
	
	When the compiler encounters this error, it stops parsing the program
	and outputs any error messages found up to that point. No object file
	is produced.
