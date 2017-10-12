---
layout: page
title: "Q64028: Changing Directories in Make Files Not Supported by NMK.COM"
permalink: /pubs/pc/reference/microsoft/kb/Q64028/
---

	Article: Q64028
	Product: Microsoft C
	Version(s): 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.11 S_QUICKC S_C
	Last Modified: 31-AUG-1990
	
	Using a command to change directories in a make file will cause
	unexpected results with NMK.COM version 1.11. This is a side effect of
	a problem with NMAKE.EXE where directory changes within make files are
	executed while processing the make file, and the current directory is
	not reset upon exit.
	
	NMK spawns NMAKE to do its processing. While NMAKE is processing, if
	it sees a change drive/directory command, it must make the change to
	finish processing the make file. The problem is that it doesn't reset
	the drive when it is through processing. This causes NMK, when control
	is returned to it, to spawn the actual commands from the final
	drive/directory, rather than where it was originally invoked.
	
	The make file below, if run from Drive D, will demonstrate the
	problem. It works properly with NMAKE.EXE but not with NMK.COM.
	
	all: cded.exe
	
	cded.exe: cded.obj
	  c:\
	  copy cded.obj cded.exe
	
	cded.obj: cded.mak
	  copy cded.mak c:\cded.obj
	
	To work around the problem, add a line at the end of each place block
	where you change the drive/directory to the original one (if known).
	For example, change the above make file to the following:
	
	all: cded.exe
	
	cded.exe: cded.obj
	  c:\
	  copy cded.obj cded.exe
	  d:
	
	cded.obj: cded.mak
	  copy cded.mak c:\cded.obj
