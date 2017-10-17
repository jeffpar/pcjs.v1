---
layout: page
title: "Q59255: C 5.10 Has a Default Threshold of 32,767 Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q59255/
---

## Q59255: C 5.10 Has a Default Threshold of 32,767 Bytes

	Article: Q59255
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 15-MAY-1990
	
	Question:
	
	I am developing a real-time, 3-D graphics application in large model
	that uses a rather large static array of structures. I expand the size
	of my array by one element, and my program runs significantly slower.
	I restore the size of my array to its original value, and the program
	runs at normal speed. What is the cause of this problem?
	
	Response:
	
	The C version 5.10 compiler has a default data threshold value of
	32,767 bytes. The size of your static array is probably close to that
	of the default data threshold and when you add another element, it
	puts you over the limit. In that case, your data is moved to a far
	data segment, thus causing the speed hit on your program.
	
	To work around this problem, you could set /Gt to a value greater than
	the size of your static array, or you could explicitly declare the
	array as being near.
	
	For more information on the /Gt switch, refer to the "Microsoft C
	Optimizing Compiler User's Guide."
