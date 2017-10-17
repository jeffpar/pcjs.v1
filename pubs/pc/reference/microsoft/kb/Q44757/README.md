---
layout: page
title: "Q44757: Multiple Targets in NMAKE Do Not Work"
permalink: /pubs/pc/reference/microsoft/kb/Q44757/
---

## Q44757: Multiple Targets in NMAKE Do Not Work

	Article: Q44757
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 docerr S_QUICKC
	Last Modified: 2-JUN-1989
	
	Multiple targets in the QuickC Version 2.00 NMAKE utility do not work
	properly. The example on the top of Page 167 of the "Microsoft QuickC
	Tool Kit" manual shows that each target listed before the dependencies
	should be evaluated; however, only the first target is evaluated, and
	the others are ignored. Make files that are simplified even more
	respond the same way.
	
	The following make file demonstrates the problem:
	
	    target1.exe target2.exe: depend1.obj depend2.obj
	        echo $@
	
	For the make file to work properly, change the file to the
	following:
	
	    BUILD: target1.exe target2.exe
	
	    target1.exe: depend1.obj depend2.obj
	        echo $@
	
	    target2.exe: depend1.obj depend2.obj
	        echo $@
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
