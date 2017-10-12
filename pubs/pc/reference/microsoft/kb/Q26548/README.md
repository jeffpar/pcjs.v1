---
layout: page
title: "Q26548: Cannot Load CTRL+Z-Terminated Files with Less than 129 Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q26548/
---

	Article: Q26548
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.10 buglist2.00 buglist2.10 qfbv
	Last Modified: 4-NOV-1988
	
	Problem:
	
	When using the F(ile) O(pen) command to load a text file which has
	less than 129 bytes and is terminated with a hex 1A (decimal 26,
	CTRL+Z, EOF), CodeView issues the error message "Not a text file." If
	the CTRL+Z character is removed, or if the file size is 129 bytes or
	greater, CodeView has no problem loading it.
	
	Response:
	
	Microsoft has confirmed this to be a problem in Version 1.00, 1.10,
	2.00, and 2.10. We are researching this problem and will post new
	information as it becomes available.
