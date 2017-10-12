---
layout: page
title: "Q66646: U4007 Error Can Be Caused By Not Using Quotation Marks"
permalink: /pubs/pc/reference/microsoft/kb/Q66646/
---

	Article: Q66646
	Product: Microsoft C
	Version(s): 1.11 1.12
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 7-NOV-1990
	
	If you have a makefile for OS/2 that uses long filenames, you must use
	quotation marks around the long filenames. For instance, if the
	following makefile is used, it will generate the U4007 error message
	("file name too long:  truncating to 8.3"):
	
	Sample Makefile
	---------------
	
	all: thisisalongfilename.exe
	
	thisisalongfilename.exe: thisisalongfilename.obj
	   link thisisalongfilename.obj;
	
	thisisalongfilename.obj: thisisalongfilename.c
	   cl /c /Tcthisisalongfilename.c
	
	If the makefile above is changed to the following version, the error
	will not be generated:
	
	Sample Makefile
	---------------
	
	all: "thisisalongfilename.exe"
	
	"thisisalongfilename.exe": "thisisalongfilename.obj"
	   link "thisisalongfilename.obj";
	
	"thisisalongfilename.obj": "thisisalongfilename.c"
	   cl /c /Tc"thisisalongfilename.c"
	
	For more information on this behavior, please see the README.DOC file
	shipped with Microsoft C version 6.00.
