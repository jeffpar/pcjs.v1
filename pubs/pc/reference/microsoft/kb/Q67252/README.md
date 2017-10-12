---
layout: page
title: "Q67252: Documentation Error in APT and Tiny Model Link Line Example"
permalink: /pubs/pc/reference/microsoft/kb/Q67252/
---

	Article: Q67252
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 29-NOV-1990
	
	As stated in the Microsoft C version 6.00 README.DOC, page 36 of the
	"Advanced Programming Techniques" manual incorrectly states that to
	link a tiny model program, you must link in CRTCOM.OBJ.
	
	Note: You must link with CRTCOM.LIB, not CRTCOM.OBJ.
	
	The link line below is an example of other requirements needed to link
	a tiny model program. These requirements include putting the
	CRTCOM.LIB file before the actual compiled .OBJ file on the link
	command line. The effect of putting this library first on the link
	line is that the entire library is linked into the output file.
	CRTCOM.LIB contains special .COM file start-up code, which is to be
	used instead of the small model start-up code in SLIBCE.LIB. This code
	must be first because CRTCOM.LIB contains the entry point for the
	program, which must be at the beginning of the file (which loads at
	100H).
	
	If this is not done, the following error message is produced:
	
	   LINK : fatal error L2051: start address not equal to
	          0x100 for /TINY
	
	Because the new executable will be named CRTCOM.COM by default, you
	should specify a new .COM name. Also, the /NOE switch is necessary
	because CRTCOM.LIB replaces the start-up code in SLIBCE.LIB.
	
	Link Line Example:
	
	   link /NOE crtcom.lib test.obj,test.exe;
	
	As stated above, this documentation error is noted in the README.DOC
	shipped with C version 6.00.
