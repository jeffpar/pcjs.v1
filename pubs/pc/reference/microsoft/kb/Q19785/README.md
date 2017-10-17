---
layout: page
title: "Q19785: Local Variable Allocation Is Limited to 32K"
permalink: /pubs/pc/reference/microsoft/kb/Q19785/
---

## Q19785: Local Variable Allocation Is Limited to 32K

	Article: Q19785
	Version(s): 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                    | OS/2
	Flags: ENDUSER | s_quickc stack
	Last Modified: 15-JAN-1991
	
	The total amount of space that can be allocated for variables local to
	a function is 32K. Trying to allocate more than this will result in
	the following compiler error:
	
	   fatal error C1126: automatic allocation exceeds 32K
