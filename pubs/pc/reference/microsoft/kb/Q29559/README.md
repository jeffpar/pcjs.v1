---
layout: page
title: "Q29559: Predefined File Handles in OS/2 Are Stdin, Stdout, and Stderr"
permalink: /pubs/pc/reference/microsoft/kb/Q29559/
---

	Article: Q29559
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The only files predefined in OS/2 are the following:
	
	   stdin, stdout, and stderr
	
	By default, these files have the integer file handles 0, 1, and 2.
	Under OS/2, the file handles stdprn and stdaux are not predefined as
	they are under DOS.
	
	Problems may occur when using the compiler for creating programs that
	attempt to write to stdaux and stdprn in OS/2 protect mode. References
	to these files are not detected by the compiler because it works in
	dual mode under both OS/2 and DOS. However, writing to stdaux or
	stdprn will fail under OS/2.
	
	No compiler errors, linker errors, or warnings are generated in these
	cases.
