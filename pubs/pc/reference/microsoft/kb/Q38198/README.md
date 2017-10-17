---
layout: page
title: "Q38198: Run-Time Functions remove and unlink both Delete a File"
permalink: /pubs/pc/reference/microsoft/kb/Q38198/
---

## Q38198: Run-Time Functions remove and unlink both Delete a File

	Article: Q38198
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 21-NOV-1988
	
	The Microsoft C Optimizing Compiler Run-Time Library contains two
	routines that delete a file. The remove function is documented on Page
	490, and the unlink function is documented on Page 628 of the
	"Microsoft C Optimizing Compiler Run-Time Library Reference" manual.
	Both routines take the same argument and perform the same operation.
	
	The unlink function exists for Unix/XENIX compatibility. This
	information is documented in Sections B.2.1, B.2.3, and B.5.4 of the
	same manual.
