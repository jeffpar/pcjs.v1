---
layout: page
title: "Q59892: LIB.EXE Failure When Trying to Build Large Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q59892/
---

## Q59892: LIB.EXE Failure When Trying to Build Large Libraries

	Article: Q59892
	Version(s): 3.11   | 3.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_lib appnote
	Last Modified: 17-DEC-1990
	
	When using versions of the Microsoft Library Manager (LIB.EXE) earlier
	than Version 3.14 to try to build large libraries with many symbols
	and modules, the LIB program may fail due to capacity limits.
	
	If you encounter various failures or random errors when trying to
	build a large library (for example, the Greenleaf Libraries), you
	should contact Microsoft Product Support at (206) 637-7096 to obtain a
	more recent version of LIB.EXE.
	
	LIB.EXE is shipped with all Microsoft language products for building
	and maintaining run-time libraries. Earlier versions of LIB run into
	problems when the library size approaches 200K or larger, but the
	point at which LIB may fail varies widely. LIB capacity is
	unpredictable because it is affected by such items as the number of
	symbols, the number of modules, and the length of symbol names.
	
	Sometimes, just changing the order in which modules are added to a
	large library will resolve the problem (or at least alter the point of
	failure or the particular errors generated). Some of the errors
	reported from capacity failures are U1174, U1188, and U1189.
	
	Errors such as U1174 and U1189 are documented only as being problems
	for which you should contact Microsoft Product Support. In general,
	these errors indicate major LIB capacity overflow problems and the
	best workaround is to update to a newer version of LIB.EXE.
