---
layout: page
title: "Q25024: Difference Between Minimum Load Size and Minimum Allocation"
permalink: /pubs/pc/reference/microsoft/kb/Q25024/
---

## Q25024: Difference Between Minimum Load Size and Minimum Allocation

	Article: Q25024
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_link s_exehdr s_exemod
	Last Modified: 6-FEB-1991
	
	The following is a summation of the differences between the minimum
	load size and the minimum allocation size in a DOS executable (.EXE)
	file header:
	
	The minimum load size is the amount of memory needed for the load
	module, plus the minimum allocation value. This reflects the amount of
	memory necessary to load and run the program, assuming no dynamic
	allocation is necessary.
	
	The minimum allocation is the amount of memory needed above the actual
	load module. These values determine the highest memory location into
	which the program can be loaded. For example, if the minimum load size
	is 0, the program will be loaded at the highest possible location in
	memory.
