---
layout: page
title: "Q46741: Possible Cause for Slow Stream I/O"
permalink: /pubs/pc/reference/microsoft/kb/Q46741/
---

	Article: Q46741
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 25-JUL-1989
	
	Question:
	
	I have an application program that does intensive file manipulation
	with the stream level I/O routines. Normally it works very fast, but
	lately the file operations have become increasingly slower and now it
	can take several minutes to process a single file. What causes this
	time delay in the stream I/O routines and how can I prevent it?
	
	Response:
	
	The stream level I/O routines inherit their speed and flexibility from
	the buffering system they use. Upon opening a file with the fopen
	function, a file record is created that contains pointers into a
	stream buffer. This buffer is then allocated (malloc-ed) when the
	first I/O operation is performed. If there is not enough room in the
	heap for this buffer allocation, the file operation continues with a
	buffer size of one character.
	
	A stream I/O routine that takes an excessive amount of time is most
	likely the result of a failure to allocate the 512-byte buffer on the
	heap (near or far, depending on the memory model). Without this
	buffer, the I/O routines are extremely slow, requiring disk access for
	all I/O operations.
	
	To get around this problem, you can do one of two things. Reduce the
	amount of allocation on the heap. Or, change memory models to compact
	or large (if you are in small or medium). If you change memory models,
	you may need to use the /Gt switch to push static data out of DGROUP.
