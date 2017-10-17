---
layout: page
title: "Q38319: C Setup Gives Error U2155 When Building Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q38319/
---

## Q38319: C Setup Gives Error U2155 When Building Libraries

	Article: Q38319
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_LIB
	Last Modified: 15-JAN-1990
	
	Problem:
	
	When installing Optimizing C, I get the following error:
	
	   LIB : error U2155: <path> : module not in library; ignored
	
	Response:
	
	Most likely, this is caused by having a dash (-) embedded in the path
	specified as the combined libraries destination. Restart SETUP and do
	not include a dash in the library path.
	
	This is a problem with LIB.EXE.
	
	LIB cannot handle the "-" (hyphen, dash) character embedded in a
	directory/file name. Instead, it interprets the dash as the extraction
	operator giving rise to error U2155. The hyphen is a legal character
	for DOS file and directory names and many people use it (for example,
	MS-C for the C directory.) In this example, LIB will terminate with
	the following cryptic message:
	
	   U2155:   C:\MS-C\MLIBCE.LIB  module not in library (ms.obj)
	
	The message is dependent upon the directory/file name used, but the
	symptom is always the same: module not in library, invalid object
	module, object file not found, etc.
	
	Note: this error can occur in situations other than setting up the
	compiler. Anytime you pass a directory/file name that contains a
	hyphen, you can cause this behavior.
