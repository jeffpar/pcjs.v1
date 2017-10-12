---
layout: page
title: "Q68010: Quickwatch Seems to Hang When Expanding Very Large Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q68010/
---

	Article: Q68010
	Product: Microsoft C
	Version(s): 3.00 3.10 3.11 | 3.00 3.10 3.11
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	When expanding an element in a large array (usually greater than 1000
	elements, but system dependent), the quickwatch function appears to
	hang. This apparent problem is caused by the time it takes to re-align
	the data in the window, and is actually normal operation. If you place
	the same array element in the Watch Window, it will expand instantly.
