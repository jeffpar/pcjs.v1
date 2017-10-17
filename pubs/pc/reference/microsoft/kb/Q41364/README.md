---
layout: page
title: "Q41364: QuickC 2.00 README.DOC: Using QuickC on a Floppy System"
permalink: /pubs/pc/reference/microsoft/kb/Q41364/
---

## Q41364: QuickC 2.00 README.DOC: Using QuickC on a Floppy System

	Article: Q41364
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JAN-1990
	
	The following information is taken from the QuickC 2.00 README.DOC
	file, Part 1, "Notes on 'Up and Running.'" The following notes refer
	to Page 16 of "Up and Running": Using QuickC on a Floppy-Disk System.
	
	QuickC requires certain files. One arrangement that works well for
	dual- floppy systems is this:
	
	     disk 1:   qc.exe
	
	     disk 2:   qcc.ovl
	               c1.err
	               link.exe
	               ilink.exe
	               ilinkstb.ovl
	
	     disk 3:   qc.hlp
	
	     disk 4:   qcenv.hlp
	               errors.hlp
	               graphics.hlp
	               notes.hlp
	               *.hlp (any additional help files)
	
	     disk 5:   \include\*.h
	               \lib\xlibce.lib (x = S, M, C, or L)
	               your source files
	
	Set your environment as follows:
	
	     PATH=A:\;B:\
	     SET INCLUDE=B:\INCLUDE
	     SET LIB=B:\LIB
	
	Make the B drive the default. This is by no means the only setup. It
	helps to minimize the swaps but may not be practical for large
	programs.
