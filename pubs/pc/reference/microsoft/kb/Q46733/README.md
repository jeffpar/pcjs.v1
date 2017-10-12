---
layout: page
title: "Q46733: L1008: &quot;Segment Limit Too High&quot; May Be Caused by Missing Colon"
permalink: /pubs/pc/reference/microsoft/kb/Q46733/
---

	Article: Q46733
	Product: Microsoft C
	Version(s): 3.x 4.06 4.07 5.01.21 5.03 5.05 5.10 | 5.01.21 5.03 5.05
	Operating System: MS-DOS                               | OS/2
	Flags: ENDUSER |
	Last Modified: 17-DEC-1990
	
	When linking, the following error may be caused by incorrectly
	specifying the parameters for the /SE switch on the link command line
	with the colon:
	
	   LINK : fatal error L1008: SE: segment limit set too high
	
	To generate the error, link using the /SE switch, then insert a space
	and the number of segments for the linker to use, such as the
	following:
	
	   LINK /SE 1024
	
	The correct syntax for the /SE option is with a colon separating the
	switch from the numeric argument as follows:
	
	   LINK /SE:1024
