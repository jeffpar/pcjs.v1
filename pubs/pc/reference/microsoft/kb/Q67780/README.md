---
layout: page
title: "Q67780: PWB May Record Incorrect Paths for Dependencies in Makefile"
permalink: /pubs/pc/reference/microsoft/kb/Q67780/
---

## Q67780: PWB May Record Incorrect Paths for Dependencies in Makefile

	Article: Q67780
	Version(s): 1.00 1.10  | 1.00 1.10
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist1.00 buglist1.10
	Last Modified: 6-FEB-1991
	
	Creating a program list with dependencies in directories other than
	the project (makefile) directory may result in the Programmer's
	WorkBench (PWB) recording the wrong paths to these dependencies.
	
	The following steps illustrate the problem:
	
	1. Create subdirectories named TEST and TESTA under the same
	   directory, with sample files FOO.C in TEST and GOO.C in TESTA.
	
	2. Invoke PWB from the TESTA directory.
	
	3. Create a program list.
	
	4. Add FOO.C and GOO.C with full path.
	
	5. Save the list.
	
	The resulting makefile will contain the line:
	
	   OBJS = goo.c foo.c
	
	The correct line should read:
	
	   OBJS = goo.c ..\TEST\foo.c
	
	Changing the location of the project makefile or changing the names of
	the subdirectories will generate the correct paths for dependencies in
	the makefile.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench versions 1.00 and 1.10. We are researching this problem and
	will post new information here as it becomes available.
