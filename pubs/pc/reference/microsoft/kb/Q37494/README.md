---
layout: page
title: "Q37494: Differences in MAKE Files among QuickC 1.00, 1.01, and 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q37494/
---

## Q37494: Differences in MAKE Files among QuickC 1.00, 1.01, and 2.00

	Article: Q37494
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	If you have upgraded from QuickC Version 1.00 or 1.01 to Version 2.00,
	and you have already created MAKE files for your programs under the
	previous versions of QuickC, you must make the following changes to
	these MAKE files so that they are compatible with QuickC Version
	2.00's NMAKE utility.
	
	To convert old-style MAKE files to NMAKE files, do the following:
	
	Note: It is almost always easier and quicker to delete the old
	MAKE file and allow QuickC Version 2.00 to build a new one from
	scratch.
	
	1. Make a copy of your old MAKE file, so you can return to the
	   original if needed.
	
	2. Remove the two lines of the inference rule by deleting them or
	   commenting them out with a "#" at the start of the
	   line.
	
	   The inference rule is in the form of the following:
	
	            .c.obj
	                qcl /c /AM $*.c
	
	3. Add the following as the new first target:
	
	   "all: prog.exe"
	   (where "prog" is the name of your program's executable)
	
	4. Change "Prog.exe" to "prog.exe" in the last target "prog.obj".
	   (Again "prog" is the name of your program's executable.)
	
	5. Enter QuickC.
	
	6. Choose the MAKE menu and the SET option
	
	7. Save the MAKE file.
	
	The MAKE file has now been converted so that it is compatible with
	QuickC Version 2.00's NMAKE.
	
	This information can be found in the "Microsoft QuickC 2.00 Toolkit"
	manual in Sections 7.5 and 7.6. A complete description of NMAKE's
	capabilities and functionality can be found in Chapter 7.
