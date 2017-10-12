---
layout: page
title: "Q51723: Using &quot;.&quot; for Path in Inference Rules Causes U1073"
permalink: /pubs/pc/reference/microsoft/kb/Q51723/
---

	Article: Q51723
	Product: Microsoft C
	Version(s): 1.00 1.01 | 1.01
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.01
	Last Modified: 18-DEC-1989
	
	NMAKE does not accept a dot (.) to identify the current directory in
	inference rule paths. When specifying paths for each of the
	extensions, using the following form
	
	   {frompath}.fromextension{topath}.toextension
	
	and using "{.}" (without the quotation marks) to indicate the current
	directory for the "topath", causes the following error:
	
	   NMAKE : fatal error U1073: don't know how to make 'filename.ext'
	
	To work around this, the current directory for topath must be
	specified with "{}". However, both notations are acceptable when
	specifying the "frompath".
	
	The following makefile causes the error:
	
	.SUFFIXES: .h .c .obj .exe
	
	#macros
	a=tools.h
	jbo=grdemo.obj turtle.obj menu.obj
	cc=qcl -c
	
	#inference rules
	{d:\qc2\work}.c{.}.obj:          #*** the '{.}' must be '{}' ***
	 $(cc) $<
	
	{}.obj{d:\qc2\lib}.exe:
	 link $(**R),,, graphics.lib;
	
	#target-dependencies
	run: d:\qc2\lib\grdemo.exe
	
	d:\qc2\lib\*.obj: d:\qc2\work\*.c
	
	d:\qc2\lib\grdemo.exe: $(jbo)
