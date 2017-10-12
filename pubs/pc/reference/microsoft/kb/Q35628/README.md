---
layout: page
title: "Q35628: The Total Bytes in MAP File Differs from Load Size in EXEMOD"
permalink: /pubs/pc/reference/microsoft/kb/Q35628/
---

	Article: Q35628
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S880908-4
	Last Modified: 19-SEP-1988
	
	Question:
	
	When I run EXEMOD on my executable file and look at the minimum load
	size, it always is greater than or equal to the size of my executable
	listed in my MAP file. Why?
	
	Response:
	
	EXEMOD reflects the minimum load size of a program that is rounded up
	to the 16-byte paragraph level. As a result, the minimum load size
	will be up to 15-bytes larger than the size of the program indicated
	in your MAP file.
