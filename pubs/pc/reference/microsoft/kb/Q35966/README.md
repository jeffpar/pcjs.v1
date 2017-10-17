---
layout: page
title: "Q35966: Using LIB.EXE to Add, Modify, and Combine .LIB; Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q35966/
---

## Q35966: Using LIB.EXE to Add, Modify, and Combine .LIB; Quick Library

	Article: Q35966
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-DEC-1989
	
	You cannot directly add, delete, or modify routines in an existing
	Quick library (.QLB file). However, you can easily re-create Quick
	libraries using a parallel .LIB file.  You can add, delete, or modify
	routines in the .LIB file using the Library Manager (LIB.EXE) utility,
	as shown below under "More Information". You can then convert the .LIB
	file into a .QLB Quick library file with the /Q option of the linker
	(LINK.EXE).
	
	This article applies to Microsoft QuickBASIC Versions 4.00, 4.00b, and
	4.50 and to the QuickBASIC that comes with the Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2. This also
	applies to QBX.EXE which is supplied with Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	To "add" an .OBJ module to a .QLB file, you must first add the module
	to your parallel .LIB file with the Library Manager (LIB.EXE), as
	follows:
	
	   LIB YourLib.LIB + YourMod.OBJ;
	
	If the module already exists in the library, but you want to replace
	it with your new module, use the following command:
	
	   LIB YourLib.LIB -+ NewMod.OBJ;
	
	To remove a module from your library, first remove it from your .LIB
	file with the following:
	
	   LIB YourLib.LIB - YourMod;
	
	This will delete the module completely. If you want to keep a copy of
	the .OBJ file, you can create one as you delete it from your library
	with the following:
	
	   LIB YourLib.LIB -* YourMod;
	
	You can also combine entire libraries using LIB.EXE, as follows:
	
	   LIB FirstLib.LIB + NextLib.LIB;
	
	This will "add" the routines in NextLib.LIB to the FirstLib.LIB file.
	
	Once you have modified your .LIB files as you wish, you can create a
	Quick library from the .LIB file with the following LINK command line:
	
	   LINK /Q YourLib.LIB, QuickLib.QLB, NUL, BQLB41.LIB;
	
	When making a Quick library, BQLB40.LIB is required (instead of
	BQLB41.LIB) for QuickBASIC Version 4.00. BQLB41.LIB is required for
	QuickBASIC Version 4.00b, or the QuickBASIC which comes with the BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2 or BASIC PDS
	7.00 for MS-DOS and MS OS/2. The BQLB4x.LIB file comes on the release
	disk.
