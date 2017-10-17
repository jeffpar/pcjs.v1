---
layout: page
title: "Q46354: Placing a Target File in Different Directory Than Dependents"
permalink: /pubs/pc/reference/microsoft/kb/Q46354/
---

## Q46354: Placing a Target File in Different Directory Than Dependents

	Article: Q46354
	Version(s): 4.07   | 4.07
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_make
	Last Modified: 6-FEB-1991
	
	To put a target file in a directory different from its dependent file
	in a makefile, you must explicitly name the path for the target file.
	When compiling, use the /Fo switch and a path to place the .OBJ file
	in a different directory from the source. When linking, give the full
	pathname when specifying the .EXE file parameter.
	
	The following example demonstrates both aspects:
	
	# MAKE SURE THERE IS A TRAILING BLANK AFTER THE FINAL BACKSLASH
	LONGPATH=e:\c51\binr\
	SHORTPATH=e:\c51\
	
	pixel.obj:  $(LONGPATH)pixel.c
	# USE /Fo SWITCH TO PUT .OBJ FILE IN DIFFERENT DIRECTORY
	  cl /Fo$(SHORTPATH) /c $(LONGPATH)pixel.c
	
	Note that if you use a macro in the makefile for the pathname (as
	shown above), then you must be sure the final backslash (\) in the
	pathname is followed by a trailing space. If there is no trailing
	space, the backslash will be interpreted as a line-continuation
	character. When you create the makefile, use an editor that will
	preserve a trailing space, such as the Programmer's WorkBench or the
	Microsoft Editor (if you set the "trailspace" switch).
