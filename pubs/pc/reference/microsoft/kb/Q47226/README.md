---
layout: page
title: "Q47226: _makepath() and _splitpath Examples Are Incomplete"
permalink: /pubs/pc/reference/microsoft/kb/Q47226/
---

	Article: Q47226
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr S_QuickC
	Last Modified: 17-AUG-1989
	
	In the C 5.x "Microsoft C for the MS-DOS Operating System: Run-Time
	Library Reference" documentation for _makepath (Page 407) and
	_splitpath (Page 559), the examples do not compile without generating
	an indirection error. This is due to the variables being declared as
	pointers. Also, the file should include <stdlib.h>, not <dos.h>. Below
	is an example of how the file should read to compile on warning level
	3 without errors.
	
	In the QuickC Versions 1.00 and 1.01 "Microsoft QuickC Run-Time
	Library Reference," the documentation for _makepath (Page 407) and
	_splitpath (Page 559) also contain an error. The example program
	declares the ext variable as a 4-byte character array. This should be
	changed to a 5-byte array as shown below. This second problem appears
	when the file extension has a three-character extension such as
	".doc".
	
	The following code should be used in place of the examples for
	_makepath and _splitpath in the QuickC 1.x run-time documentation as
	well.
	
	#include <dos.h>
	#include <stdlib.h>
	#include <stdio.h>
	
	void main( void )
	{
	    char path_buffer [40];
	    char drive [3];
	    char dir [30];
	    char fname [9];
	    char ext [5];
	
	    _makepath (path_buffer, "d:", "\\src\\test\\", "new","dat");
	    printf("path created with _makepath: %s\n\n", path_buffer);
	
	    _splitpath (path_buffer, drive, dir, fname, ext);
	    printf("path extracted with _splitpath\n");
	    printf("drive: %s\n", drive);
	    printf("dir: %s\n", dir);
	    printf("fname: %s\n", fname);
	    printf("ext: %s\n", ext);
	}
