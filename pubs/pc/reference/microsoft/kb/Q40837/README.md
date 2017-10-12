---
layout: page
title: "Q40837: Maximum Number of Include Directories Is 15"
permalink: /pubs/pc/reference/microsoft/kb/Q40837/
---

	Article: Q40837
	Product: Microsoft C
	Version(s): 5.00 5.10  | 5.10
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | limits
	Last Modified: 31-JAN-1989
	
	There is a maximum number of directories you can set in both the
	compile line and the INCLUDE environment variable. The combined
	maximum is 15. Exceeding the maximum can cause the error U1013 or
	U1077 in a MAKE file.
	
	No error message is given if the compile line is typed in directly
	from the DOS prompt. The program just fails to compile. This maximum
	applies to both DOS and OS/2.
	
	Note: If you have 14 directories in your include environment variable
	and added several others at the command line (with one /I, as opposed
	to using a /I for every directory), you could break this boundary.
	However, you should normally avoid using more than 15 directories.
