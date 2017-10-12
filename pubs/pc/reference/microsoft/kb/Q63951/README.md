---
layout: page
title: "Q63951: PWB Command-Line Option /DP Is Documented But Not Implemented"
permalink: /pubs/pc/reference/microsoft/kb/Q63951/
---

	Article: Q63951
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 27-JUL-1990
	
	The /DP switch for the Programmer's WorkBench (PWB), documented on
	Page 49 of the version 6.00 "Microsoft C Reference," is not
	implemented in version 1.00 of the PWB. This switch is designed to
	ignore the most recent program list upon starting the PWB.
	
	The /DP switch is mentioned only in the "Microsoft C Reference" and
	not in the online help.
	
	Upon invocation, the Programmer's WorkBench version 1.00 does not
	automatically set the program list to the last program list used.
	Therefore, the /DP command-line switch was not implemented because it
	would have no purpose.
	
	With the PWB version 1.00, there is no way to have the last program
	list set automatically at startup.
