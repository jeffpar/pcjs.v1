---
layout: page
title: "Q66345: BSEDOS.H in C 6.00 Has Incorrect Prototypes"
permalink: /pubs/pc/reference/microsoft/kb/Q66345/
---

## Q66345: BSEDOS.H in C 6.00 Has Incorrect Prototypes

	Article: Q66345
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 21-JAN-1991
	
	The prototypes for DosPeekQueue() and DosFileLocks() in the BSEDOS.H
	file are incorrect.
	
	The fourth parameter for DosPeekQueue() is defined in the header file
	as being of type PULONG, as shown in the following:
	
	   PULONG ppBuf
	
	For OS/2 versions 1.x, the fourth parameter should be as follows:
	
	   PVOID FAR *ppBuf
	
	The prototype is correct as it is for OS/2 version 2.00.
	
	For OS/2 versions 1.x, the second and third parameters for
	DosFileLocks() are defined as being of type PLONG, and should be of
	type PFILELOCK.
	
	This function does not exist in OS/2 version 2.00.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
