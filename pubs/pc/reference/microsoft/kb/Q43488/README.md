---
layout: page
title: "Q43488: QuickC: GRDEMO Sample Program Gives Run-Time Error R6003"
permalink: /pubs/pc/reference/microsoft/kb/Q43488/
---

## Q43488: QuickC: GRDEMO Sample Program Gives Run-Time Error R6003

	Article: Q43488
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 18-MAY-1989
	
	In the sample program GRDEMO.C, which is provided with QuickC Version
	2.00, changing the aspect ratio of the window to zero will cause the
	following run-time error to occur:
	
	   R6003: Integer divide by zero
	
	A simple bounds check may be added to the program to prevent the
	error.
