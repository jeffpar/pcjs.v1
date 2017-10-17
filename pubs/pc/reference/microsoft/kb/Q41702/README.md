---
layout: page
title: "Q41702: #define Source-Code Line Error in Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q41702/
---

## Q41702: #define Source-Code Line Error in Manual

	Article: Q41702
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 28-FEB-1989
	
	The following documentation error occurs on Page 173 of the "Microsoft
	QuickC 2.00 Graphics Library Reference" manual. The source-code line
	reads as follows:
	
	   #define RGB(r,g,b) (((long) ((b) < 8 | (g)) < 8) | (r))
	
	The line should read as follows:
	
	   #define RGB(r,g,b) (((long) ((b) << 8 | (g)) << 8) | (r))
	
	The bit-shift operator should replace the logical less than
	sign.
