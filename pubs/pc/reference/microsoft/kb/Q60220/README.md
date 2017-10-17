---
layout: page
title: "Q60220: No Space Needed in &quot;/O MY.SRC&quot; in HELPMAKE, Programmer's Guide"
permalink: /pubs/pc/reference/microsoft/kb/Q60220/
---

## Q60220: No Space Needed in &quot;/O MY.SRC&quot; in HELPMAKE, Programmer's Guide

	Article: Q60220
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 8-JAN-1991
	
	Page 673 in the "Microsoft BASIC 7.0: Programmer's Guide" (for
	versions 7.00 and 7.10) incorrectly shows a space between "/O" and
	"MY.SRC" in the following example for decoding a Help database:
	
	   HELPMAKE /V /D /O MY.SRC MY.HLP > MY.LOG
	
	Using this syntax gives the error ":fatal error H1100: cannot open
	file." The correct syntax is as follows:
	
	   HELPMAKE /V /D /OMY.SRC MY.HLP > MY.LOG
	
	The sample syntax given on the bottom of Page 672 shows the "/O"
	option as it should be used.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Versions 7.00 and 7.10 for MS-DOS and MS OS/2.
