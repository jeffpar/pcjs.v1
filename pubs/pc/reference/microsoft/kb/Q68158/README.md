---
layout: page
title: "Q68158: BASIC 7.10 LINK &quot;L4051 Cannot Find Library&quot; If Using 7.00 .LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q68158/
---

## Q68158: BASIC 7.10 LINK &quot;L4051 Cannot Find Library&quot; If Using 7.00 .LIB

	Article: Q68158
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S901113-69 LINK.EXE 4051
	Last Modified: 15-JAN-1991
	
	If you get the linker warning message "L4051 : BCL70xxx.LIB : cannot
	find library" while linking a program in BASIC PDS version 7.10, the
	problem may be that you are linking to a .LIB library you created with
	BASIC PDS 7.00. This will happen even if BASIC PDS version 7.00 has
	been deleted from your hard disk. If you created your own .LIB library
	in 7.00 and then link it to your BASIC 7.10 module, then you will need
	to recompile the BASIC routines in the .LIB using BASIC version 7.10
	and rebuild the .LIB library (using the LIB.EXE Library Manager).
	
	The L4051 error can also occur because of an incorrectly set LIB path.
	Type "SET" at the DOS command line to be sure that the LIB environment
	variable points to the BASIC 7.10 libraries. You can set the LIB path
	(automatically at boot time) in your AUTOEXEC.BAT batch file as
	follows:
	
	   SET LIB=C:\BC71\LIB
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.10 for MS-DOS and MS OS/2.
	
	To duplicate the "L4051 : cannot find library" warning, build a
	library from the following code using BASIC version 7.00:
	
	'test.bas
	'demo file built with BASIC PDS 7.00
	SUB Pds70sub
	print "this is from the library built with PDS 7.00"
	END SUB
	
	Compile and build the library as follows in BASIC version 7.00:
	
	   BC /O /Fs test ;
	   LIB mylib + test ;        [builds MYLIB.LIB]
	   LINK /Q mylib.lib,mylib.qlb,,qbxqlb.lib ;    [links MYLIB.QLB]
	
	Then create a module to CALL the above SUBprogram Pds70sub from the
	library MYLIB:
	
	'main.bas
	'This module calls the SUBprogram in a library created with PDS 7.00
	print "this is the calling module"
	call pds70sub
	
	Compile and link as follows in BASIC version 7.10:
	
	   BC /O /Fs main ;
	   LINK main,,,BCL71EFR.LIB + MYLIB.LIB ;
	
	Now you should receive the warning message:
	
	   LINK : warning L4051 : BCL70EFR.lib : cannot find library
	   Enter new file spec:
	
	To correct the problem, recompile, relink, and rebuild the library
	MYLIB using BASIC PDS version 7.10.
