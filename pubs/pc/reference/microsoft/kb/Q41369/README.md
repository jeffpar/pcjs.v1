---
layout: page
title: "Q41369: Run-Time Library Reference vfprintf Documentation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q41369/
---

	Article: Q41369
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 16-MAY-1989
	
	Page 636 of the "Microsoft C 5.10 Optimizing Compiler Run-Time Library
	Reference" and the "Microsoft QuickC Run-Time Library Reference"
	contains an error. In the example listed, the line
	
	   error("Error: line %d, file  filename);
	
	should read
	
	   error("Error: line %d, file %s\n", line, filename);
