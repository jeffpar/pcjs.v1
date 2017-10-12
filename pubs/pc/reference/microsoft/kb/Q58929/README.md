---
layout: page
title: "Q58929: BIND Error "Import By Ordinal Not Defined: DOSCALLS.5""
permalink: /pubs/pc/reference/microsoft/kb/Q58929/
---

	Article: Q58929
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_bind
	Last Modified: 27-DEC-1990
	
	Question:
	
	When I use BIND version 1.00 to bind my OS/2 program, the following
	error message is returned:
	
	   Import by ordinal not defined: DOSCALLS.5
	
	I bind my program with the following:
	
	   BIND hello.exe -o hellob.exe
	
	Why do I get that error when I call FAPI functions by name and not
	their ordinal numbers?
	
	Response:
	
	The above error occurs because DOSCALLS.LIB must be listed on the BIND
	command line. Bind automatically searches for API.LIB and OS2.LIB
	(using the LIB environment variable), but not DOSCALLS.LIB.
	
	When using bind, DOSCALLS.LIB must be explicitly listed on the command
	line and the LIB environment variable must point to API.LIB and
	OS2.LIB. For example:
	
	   BIND hello.exe c:\c510\lib\doscalls.lib -o hellob.exe
