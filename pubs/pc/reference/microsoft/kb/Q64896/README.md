---
layout: page
title: "Q64896: &quot;Statement Unrecognizable&quot; Using &quot;_&quot; in DATA Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q64896/
---

## Q64896: &quot;Statement Unrecognizable&quot; Using &quot;_&quot; in DATA Statement

	Article: Q64896
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900807-9 B_BasicCom
	Last Modified: 5-SEP-1990
	
	The line-continuation character in BASIC (the underscore, "_") cannot
	be used to continue a DATA statement. Using an underscore on a DATA
	statement gives a "Statement unrecognizable" error message at compile
	time. This is a design limitation of the line-continuation feature of
	Microsoft BASIC compilers.
	
	The following lines, when compiled, demonstrate this behavior:
	
	   DATA 10, 20, 30,_
	        40, 50, 60
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS; and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
