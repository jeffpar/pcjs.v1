---
layout: page
title: "Q37641: Different OS/2 Libraries: DOSCALLS.LIB OS2.LIB API.LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q37641/
---

	Article: Q37641
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JAN-1989
	
	Question:
	
	What are the differences between DOSCALLS.LIB, OS2.LIB, and API.LIB?
	
	Response:
	
	DOSCALLS.LIB has the OS/2 Version 1.00 systems calls in it.
	
	OS2.LIB is a superset of DOSCALLS.LIB, this library came with the
	OS/2 SDK not with the retail version of C 5.1. It has the OS/2
	Version 1.10 systems calls in it (PM calls have been added to the
	OS/2 Version 1.00 calls).
	
	API.LIB is the library used for programs that are going to be bound to
	run in both OS/2 and DOS. They are the FAPI ( Family API) routines.
	
	You can use OS2.LIB in place of DOSCALLS.LIB because it contains all
	of the routines. Only use API.LIB if you are binding.
