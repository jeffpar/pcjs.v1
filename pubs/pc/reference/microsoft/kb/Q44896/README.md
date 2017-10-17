---
layout: page
title: "Q44896: Page Size May Cause Big Size Increase When Combining Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q44896/
---

## Q44896: Page Size May Cause Big Size Increase When Combining Libraries

	Article: Q44896
	Version(s): 3.0x 3.11 3.14 3.17 | 3.11 3.14 3.17
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_lib
	Last Modified: 15-JAN-1991
	
	Question:
	
	When I use LIB.EXE to combine my libraries with a third-party library,
	the resultant library is much larger than I expected it to be.
	
	The following is an example:
	
	    LIB1.LIB    5K   bytes
	    LIB2.LIB    250K bytes
	
	    LIB1.LIB + LIB2.LIB  = 305K bytes
	
	Why is the combined file 50K larger?
	
	Response:
	
	This size difference may be the result of different page sizes among
	the libraries being combined. The page size of a library affects the
	alignment of modules stored in the library. When libraries with
	different page sizes are combined, the resultant library uses the
	largest page size from the constituent libraries. Thus, the actual
	increase in file size represents wasted space between modules in the
	library. To reduce the amount of wasted space, you should specify a
	smaller page size for the new library. This may be accomplished by
	using the library manager as follows:
	
	   LIB BIG.LIB /PAGESIZE:16;
	
	This sets the page size for the library BIG.LIB to 16 bytes.
	
	As indicated in the library manager documentation, the page size must
	be an integer power of 2 from 16 to 32,768 bytes.
