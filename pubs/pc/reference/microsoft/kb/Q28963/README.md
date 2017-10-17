---
layout: page
title: "Q28963: BC Makes Smaller EXE than Make EXE File Using .LIB; e.g. Mouse"
permalink: /pubs/pc/reference/microsoft/kb/Q28963/
---

## Q28963: BC Makes Smaller EXE than Make EXE File Using .LIB; e.g. Mouse

	Article: Q28963
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 8-MAR-1989
	
	Object (.OBJ) files linked to .LIB libraries from the DOS command line
	may produce a smaller .EXE file than will be created with the Make EXE
	File... option if you invoked QB.EXE Version 4.00 or 4.00b with the /L
	option to use a Quick library (.QLB) file.
	
	If the BC compiler options are the same for the two methods of making
	the .EXE file, then the .EXE size difference depends on the syntax of
	the LINK statement used to create the executable program, as follows:
	
	1. If the .LIB file is specified in the .OBJ list (the first argument)
	   for LINK.EXE, then ALL routines in the .LIB file are linked into the
	   .EXE.
	
	   When you invoke QB.EXE Version 4.00 or 4.00b with the /L option
	   to load a Quick library, the Make EXE File... option automatically
	   puts the .LIB (that matches the Quick library) in the .OBJ list,
	   often making a larger .EXE.
	
	2. If the .LIB file is specified in the .LIB list (the fourth
	   parameter) for LINK.EXE, then just the external routines called from
	   programs in the .OBJ list are pulled into the .EXE file from the .LIB
	   file.
	
	   QB.EXE Version 4.50 has been enhanced to do this automatically
	   when you invoke with /L to load a Quick library and you choose
	   the Make EXE File... option. This can make a smaller .EXE file if
	   there are uncalled routines in the .LIB file.
	
	This information about LINK.EXE applies to QuickBASIC Versions 4.00,
	4.00b, and 4.50 and the BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and OS/2.
	
	The example program below, MOUS.BAS, uses the statement CALL INT86old
	to access the Microsoft Mouse through interrupt 51 (33 hex). INT86old
	is an external routine contained in QB.LIB. Programs that use CALL
	INT86old must be linked with the file QB.LIB (or run inside the
	QuickBASIC editor with QB /L QB.QLB).
	
	When the program MOUS.BAS is loaded into the QuickBASIC Version 4.00
	or 4.00b editor and the Make EXE File... option is selected from the
	RUN menu, the following LINK command is issued:
	
	   LINK /EX /NOE MOUS+QB.LIB, C:MOUS.EXE, NUL,;
	
	Pressing the F4 key in the QB.EXE editor lets you toggle to view this
	command line because the editor covers the output screen by default
	after Make EXE.
	
	The resulting executable file (MOUS.EXE) has a size of 4213 bytes.
	However, if the same program is compiled from the DOS command line and
	then linked with the following command, the resulting executable file
	has a size of only 3925 bytes:
	
	   BC MOUS;
	   LINK /EX /NOE MOUS, C:MOUS.EXE, NUL, QB.LIB,;
	
	The size difference occurs because when the .LIB library files are
	specified as the fourth parameter in the LINK statement (as in the
	second LINK command above) the linker can be more "granular" than when
	the .LIB library files are included in the first parameter.
	Granularity refers to the ability of LINK.EXE to link in only those
	modules within the library file(s) that are actually referenced by the
	program. For example, if the library is composed of two object files,
	SUB1.OBJ and SUB2.OBJ, but only one of them is ever CALLed by the
	BASIC program, then only the one called will be linked into the EXE
	file.
	
	The following is the reason that Make EXE File... option in QB.EXE
	Version 4.00 and 4.00b puts the .LIB file (which correspond to a
	loaded Quick library) in the first parameter of the LINK syntax: the
	resulting EXE will more closely resemble the program as it executes
	inside the QuickBASIC editor.
	
	By popular request, the Make EXE File... option was changed in QB.EXE
	Version 4.50 to put the .LIB file in the library area for better
	granularity (i.e., smaller .EXE files).
	
	The following program CALLs the INT86old routine for drawing in
	high-resolution graphics mode with the mouse:
	
	   DECLARE SUB MOUS (m0%, m1%, m2%, m3%)
	   DEFINT A-Z
	   SCREEN 2
	   m0 = 0: m1 = 0: m2 = 0: m3 = 0: oldx = 0: oldy = 0
	   CALL MOUS(m0, m1, m2, m3)
	      'initialize mouse
	   m0 = 1
	   INPUT "press any key to turn on mouse cursor:", x
	   CALL MOUS(m0, m1, m2, m3)
	   'turn on mouse cursor
	   END
	   SUB MOUS (m0, m1, m2, m3) STATIC
	   DIM regs(7)
	           regs(0) = m0: regs(1) = m1: regs(2) = m2: regs(3) = m3
	           CALL int86old(51, regs(), regs())
	           m0 = regs(0): m1 = regs(1): m2 = regs(2): m3 = regs(3)
	   END SUB
	
	The interrupt 51 (i.e., 33 hex) for Microsoft Mouse Version 6.00 (and
	later) is documented in the following book: "Advanced MS-DOS
	Programming," Second Edition, by Ray Duncan (published by Microsoft
	Press, 1988) on Pages 593-611. (The first edition published in 1986
	did not document the mouse interrupt.)
	
	More information regarding making mouse calls from BASIC can be found
	in the "Mouse Programmer's Reference Guide," which can be ordered from
	Microsoft Customer Service by calling (206) 882-8088.
