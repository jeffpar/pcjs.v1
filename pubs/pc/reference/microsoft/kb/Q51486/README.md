---
layout: page
title: "Q51486: Missing Semicolon in Sample Average() Function"
permalink: /pubs/pc/reference/microsoft/kb/Q51486/
---

## Q51486: Missing Semicolon in Sample Average() Function

	Article: Q51486
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 14-MAR-1990
	
	In the "Microsoft C Run-Time Library Reference," Page 634, there is a
	missing semicolon (;) in the sample function called average(). Add a
	semicolon at the end of the for-loop and the sample program will work
	properly.
	
	Note: There are two average() functions on Page 634, both need a
	semicolon at the end of the for-loop.
