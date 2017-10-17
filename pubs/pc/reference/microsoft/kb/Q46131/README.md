---
layout: page
title: "Q46131: Modifying P_tmpdir Does Not Change the Operation of tmpnam()"
permalink: /pubs/pc/reference/microsoft/kb/Q46131/
---

## Q46131: Modifying P_tmpdir Does Not Change the Operation of tmpnam()

	Article: Q46131
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 25-JUL-1989
	
	The functions tmpnam() and tempnam() both state that under certain
	conditions they create a name that consists of the path prefix defined
	by the P_tmpdir entry in STDIO.H. This is ambiguous. A more correct
	way of stating this is that they create a name that consists of a path
	prefix to the root of the current drive; this is also what P_tmpdir is
	defined as. Under C Version 5.10 and QuickC Version 2.00, P_tmpdir is
	defined as the root directory on the default drive, which is where the
	created name would reside. However, any modification of P_tmpdir in
	STDIO.H does not change the filename created.
	
	It states on Page 611 of the "Microsoft C for the MS-DOS Operating
	System Run-Time Library Reference" that changing the definition of
	P_tmpdir or L_tmpnam does not change the operation of tmpnam(). Nor
	does it change the operation of tempnam(). These two defines are only
	provided for XENIX/UNIX portability. The two functions tmpnam() and
	tempnam() do not make any use of these two defines.
