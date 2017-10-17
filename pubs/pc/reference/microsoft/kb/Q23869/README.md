---
layout: page
title: "Q23869: malloc() and free() Do Not Return Memory to DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q23869/
---

## Q23869: malloc() and free() Do Not Return Memory to DOS

	Article: Q23869
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Problem:
	
	My large model program calls system() to do a directory, and then I
	malloc() a large amount of space. I can free() it all but I get a "Not
	enough memory" error when I try to call system() again. Apparently
	free() is not returning the memory to DOS.
	
	Response:
	
	When you malloc() a large amount of space (more than is available
	within the current heap), the malloc() function will execute a DOS
	call to get more memory in an attempt to expand the heap. If this is
	successful, DOS will allocate the desired memory to your program and
	malloc() will return successful. If you then free() this memory, it
	will be marked as free within your program's heap and will be
	available for use again by your program.
	
	However, DOS still sees this memory as being used by the program
	because it now resides within the program's heap. If you attempt a
	subsequent system() call, DOS may find it does not have enough free
	memory to load the code required to perform the system() function.
	
	An alternative is to use halloc() and hfree(), which will return the
	memory to DOS, rather than retaining it for use by the currently
	executing program.
