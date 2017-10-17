---
layout: page
title: "Q44207: Example for freopen Is Incorrect in C, QuickC Manuals"
permalink: /pubs/pc/reference/microsoft/kb/Q44207/
---

## Q44207: Example for freopen Is Incorrect in C, QuickC Manuals

	Article: Q44207
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC docerr
	Last Modified: 19-SEP-1989
	
	There is an error in the sample program given on Page 295 of the
	"Microsoft C Optimizing Compiler Run-Time Library Reference" for the
	freopen() function. The first fprintf() function call should be
	changed to a printf().
	
	This error is also present in the QuickC Versions 1.00, 1.01, and 2.00
	run-time library reference manuals. The sample program has been
	changed in the QuickC 2.00 on-line help example and is correct there.
