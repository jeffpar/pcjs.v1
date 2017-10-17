---
layout: page
title: "Q60340: A Complete Example of Utilizing Paths in NMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q60340/
---

## Q60340: A Complete Example of Utilizing Paths in NMAKE

	Article: Q60340
	Version(s): 1.00 1.01 1.11
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-APR-1990
	
	The make file shown below is an NMAKE example of using paths in
	macros, inference rules, and target dependencies (descriptor blocks).
	This is a working example of what is described on Page 298 of the
	"Microsoft FORTRAN CodeView and Utilities User's Guide" and Page 168
	of the "Microsoft QuickC Tool Kit."
	
	This make file compares the modification dates of the .H and the .C
	files with the .OBJ files, and the .OBJ files with the .EXE files. If
	any of the dependent files have changed more recently than the target
	files, the specified series of commands is executed. The .H and the
	.C files in the work directory are compared to the .OBJ files of the
	lib directory.
	
	If any of the source file(s) have changed since the last .OBJ was
	.created, then it is recompiled and copied from the current
	directory to the lib directory. The .OBJ files in the lib directory
	are compared to the .EXE files in the current directory. If any of the
	.OBJ files have changed since the last .EXE was created, then the
	.OBJs are relinked.
	
	Sample Make File
	----------------
	
	#macros
	
	objdir =d:\qc2\lib
	wrkdir =d:\qc2\work
	list   =$(objdir)\grdemo.obj $(objdir)\turtle.obj \
	$(objdir)\menu.obj
	cc     =qcl -c
	
	#inference rules
	
	#compile
	{$(wrkdir)}.c{$(objdir)}.obj:
	 $(cc) $<
	 copy $(*F).obj $(*R).obj
	 erase $(*F).obj
	
	#link
	{$(objdir)}.obj{}.exe:
	 link $(**R);
	
	#target-dependencies
	
	run: grdemo.exe
	
	$(objdir)\*.obj: $(wrkdir)\$$(@B).c $(wrkdir)\menu.h \
	$(wrkdir)\turtle.h
	
	grdemo.exe: $(list)
