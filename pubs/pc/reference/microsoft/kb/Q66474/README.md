---
layout: page
title: "Q66474: Documentation Error: Extmake Syntax for %&#124;partsF Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q66474/
---

## Q66474: Documentation Error: Extmake Syntax for %&#124;partsF Incorrect

	Article: Q66474
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-NOV-1990
	
	The extmake syntax for determining the complete name of the first
	dependent in a NMAKE description file is incorrectly described in the
	"Advanced Programming Techniques" manual on Page 124.
	
	The extmake syntax described on Page 124 of the "Advanced Programming
	Techniques" manual lists the syntax as
	
	   %|partsF
	
	where parts is one or more of the following:
	
	   Letter            Description
	   ------            -----------
	
	   d                 Drive
	   e                 File extension
	   f                 File base name
	   p                 Path
	   s                 Complete name
	
	However, "s" is not a valid selection. You may use %s, or you may use
	%|partsF, where "parts" is one or more of the above (d, e, f, or p,
	but not s). The following makefile illustrates the problem.
	
	Sample Makefile
	---------------
	
	   sample.obj: sample.c
	        cl /c %|sF
	
	If this makefile is run, it will produce the following error message:
	
	   NMAKE : fatal error U1098: extmake syntax in sF incorrect
	
	The online help specifies the correct syntax for using the extmake
	switch:
	
	   Letter     File-Specification Part
	   ------     -----------------------
	
	   p          Path
	   d          Drive
	   f          Base name
	   e          Extension
	
	The makefile below shows the correct extmake syntax for obtaining the
	complete name of the first dependent:
	
	Correct Makefile
	----------------
	
	   sample.obj: sample.c
	        cl /c %s
