---
layout: page
title: "Q39908: Time Functions Calculate for Daylight Savings Time"
permalink: /pubs/pc/reference/microsoft/kb/Q39908/
---

## Q39908: Time Functions Calculate for Daylight Savings Time

	Article: Q39908
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-DEC-1988
	
	The Microsoft time functions calculate for daylight savings time. In
	particular, mktime will set the hour ahead or back one hour according
	to the rules of daylight savings time. The only way to change the
	dates that the time functions use in calculating daylight savings time
	is to get the run-time library source code available for the time
	functions and modify the routine _isindst() in the file tzset.c.
