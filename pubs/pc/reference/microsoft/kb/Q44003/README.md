---
layout: page
title: "Q44003: QuickC 2.00 "Rebuild All" Doesn't Necessarily Relink"
permalink: /pubs/pc/reference/microsoft/kb/Q44003/
---

	Article: Q44003
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-MAY-1989
	
	The "Rebuild All" item under the "Make" menu in the QuickC 2.00
	environment does not necessarily perform in the manner described in
	the "Microsoft QuickC Up and Running" manual. Page 36 of this manual
	states the following:
	
	   When you choose the Rebuild All command from the Make menu, every
	   .C file in the program list is compiled into a .OBJ file.  Then
	   all of the .OBJ files are linked with .LIB files to create one
	   .EXE file.
	
	With the Incremental link option on, the object files may not be
	relinked in all cases. Using the regular linker by disabling the
	Incremental link option will relink the object files as intended.
	
	The following program and sequence of steps will demonstrate the
	problem:
	
	#include <stdio.h>
	main()
	    {
	    printf("Hello.\n");
	    }
	
	Create an additional subdirectory (e.g. LIB2) and copy SLIBCE.LIB into
	it. Run LIB on this copy and delete the printf module. Clear the LIB
	environment variable and enter QuickC, loading the above program.
	
	From the Options menu, set the LIB environment variable to the LIB2
	directory. Make sure that the Incremental Link option is selected.
	Compile the program. The linker produces the following error message,
	and no .EXE will be produced:
	
	   Error L2029 : '_printf' : Unresolved external
	
	To witness the problem, change the LIB variable to the original QuickC
	2.00 LIB directory and Rebuild All. A good .EXE will be produced;
	execute it to be sure. Now, change the LIB back to the LIB2 directory
	and select Rebuild All. The dialog box will indicate that compilation
	and linking have taken place; however, no linker error will be
	generated. The program has not been fully relinked; even though the
	timestamp on the .EXE indicates that it has been updated, the printf
	code is still intact.
	
	The workarounds are to shell out to DOS and delete the .EXE file prior
	to performing a Rebuild All or to disable incremental linking prior to
	linking.
	
	This behavior will be dangerous if one set of libraries is initially
	linked and then the LIB variable is changed to point to C 5.10 or
	other libraries in which identically named functions have different
	definitions.
