---
layout: page
title: "Q58039: &quot;Internal Error&quot; Using Two-Dimensional Single-Precision Array"
permalink: /pubs/pc/reference/microsoft/kb/Q58039/
---

## Q58039: &quot;Internal Error&quot; Using Two-Dimensional Single-Precision Array

	Article: Q58039
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist7.00 fixlist7.10
	Last Modified: 21-SEP-1990
	
	The code example below generates the error message "Internal Error
	near 8C54" when compiled using the BC.EXE shipped with Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS and MS
	OS/2. This problem does not occur in the QBX.EXE environment or in
	earlier compiler versions.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00. This problem was corrected in BASIC PDS version 7.10.
	
	Code Example
	------------
	
	  DIM a (4, 4), b(4, 4)
	  k% = i% + 1
	  a(0, j%) = a(0, k%)
	  b(0, j%) = b(0, k%)
	
	To work around this problem in 7.00, compile using the BC /D (Debug)
	option, or change the arrays to integer arrays or double-precision
	arrays. To cause the error, the array must be single precision,
	two-dimensional, and referenced with integer variables as shown.
