---
layout: page
title: "Q45464: Lack of Memory Can Cause pg_chartscatter to Fail"
permalink: /pubs/pc/reference/microsoft/kb/Q45464/
---

	Article: Q45464
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 22-JUN-1989
	
	The QuickC Version 2.00 presentation graphics functions
	_pg_chartscatter and _pg_chartscatterms fail if there is not enough
	memory in the far heap. These functions, like their cousins _pg_chart
	and _pg_chartms, depend on the availability of memory in the far heap
	for successful execution. The amount of memory needed for each
	function is directly proportional to the number of points being
	displayed. These functions return zero (0) if they execute
	successfully.
	
	To display more points with _pg_chartscatter and _pg_chartscatterms,
	try executing outside of the QuickC 2.00 environment. This method
	should free up enough memory for the functions to operate. Another way
	to free up memory is to turn debug information off.
