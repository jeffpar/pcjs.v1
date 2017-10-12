---
layout: page
title: "Q32324: C 5.00 and 5.10 putenv() Example Program Missing Backslashes"
permalink: /pubs/pc/reference/microsoft/kb/Q32324/
---

	Article: Q32324
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 15-JAN-1991
	
	The example program for the putenv() function on page 468 of the
	"Microsoft C 5.10 Optimizing Compiler Run-Time Library Reference" is
	incorrect. The C code requires double backslashes in order to work
	correctly.
	
	This is the incorrect line:
	
	   if (putenv("PATH=a\bin;b:\tmp") == 1)
	
	The corrected line (with escaped backslashes) should read as follows:
	
	   if (putenv("PATH=a:\\bin;b:\\tmp") == 1)
