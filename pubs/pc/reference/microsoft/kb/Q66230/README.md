---
layout: page
title: "Q66230: Running Out of Memory in CodeView with /X"
permalink: /pubs/pc/reference/microsoft/kb/Q66230/
---

	Article: Q66230
	Product: Microsoft C
	Version(s): 3.00 3.10 3.11
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	Under some circumstances, CodeView may still run out of memory while
	debugging large applications with the /X switch invoked to take
	advantage of extended memory with HIMEM.SYS. The debug information
	gets expanded when CodeView loads the program, so the following
	suggestions may help the problem:
	
	1. Don't use the quick compile (/qc) option. The symbolic information
	   created by the quick compiler may expand much more when loaded by
	   CodeView than the symbolic information created by the standard
	   compiler. In addition, the quick compiler may create some duplicate
	   debug references in the executable file. These duplicate references
	   can take up significant memory when CodeView loads the program.
	
	2. Use the CVPACK utility, which is documented in the online
	   documentation and on Page 21 of the "Microsoft C Reference" manual.
	   CVPACK will compress the debug information in the file by removing
	   duplicate references. Use the /P option to achieve maximum
	   compression.
