---
layout: page
title: "Q67359: Incorrect Definition Given for the Time Zone Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q67359/
---

	Article: Q67359
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 4-DEC-1990
	
	The variable, "timezone", a member of the timeb structure defined in
	SYS\TIMEB.H, is incorrectly documented as returning the difference in
	seconds between Greenwich Mean Time and local time, in both the online
	help and the Microsoft Press book, "Microsoft C Run-Time Library
	Reference." The difference is returned in minutes, not seconds.
	
	The "timezone" variable is documented correctly in both the online help
	and the Microsoft Press book, "Microsoft C Run-Time Library Reference"
	manual, in the description for the ftime() function.
