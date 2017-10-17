---
layout: page
title: "Q68836: NMAKE Doesn't Allow CD Command That Only Specifies Drive"
permalink: /pubs/pc/reference/microsoft/kb/Q68836/
---

## Q68836: NMAKE Doesn't Allow CD Command That Only Specifies Drive

	Article: Q68836
	Version(s): 1.11 1.12 | 1.11 1.12
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.11 buglist1.12
	Last Modified: 5-FEB-1991
	
	DOS and OS/2 command lines allow you to see the current directory of a
	drive by using the CD (change directory) command. For example, the
	command "CD D:" will return the current directory for the D drive.
	Because this is a valid DOS or OS/2 command, NMAKE should allow you to
	perform the command without error. However, when the NMAKE file below
	is executed, the following message occurs:
	
	   NMAKE: fatal error U1077: 'cd' :return code '1'
	
	NMAKE treats the CD command as a special case and fails to execute the
	command correctly.
	
	Sample NMAKE File:
	
	all:
	   cd d:
	
	Microsoft has confirmed this to be a problem in NMAKE versions 1.11
	and 1.12. We are researching this problem and will post new
	information here as it becomes available.
