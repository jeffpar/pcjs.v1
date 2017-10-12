---
layout: page
title: "Q67880: Hyphen in File or Directory Name Causes LIB Error U2155"
permalink: /pubs/pc/reference/microsoft/kb/Q67880/
---

	Article: Q67880
	Product: Microsoft C
	Version(s): 3.00 3.04 3.07 3.08 3.10 3.11 3.14 3.17 | 3.10 3.11 3.14
	Operating System: MS-DOS                                  | OS/2
	Flags: ENDUSER | s_lib dash minus sign
	Last Modified: 16-JAN-1991
	
	The Microsoft Library Manager utility LIB.EXE does not allow file or
	directory names to contain a hyphen (-) character. If a file or
	directory name containing a hyphen is passed to LIB.EXE, the following
	error will be generated:
	
	   LIB : error U2155: <path> : module not in library; ignored
	
	Although a hyphen is a valid character for a DOS or OS/2 filename, LIB
	interprets this character as the extraction operator that tells LIB to
	remove an object module from an existing library. Since LIB is
	assuming everything following the hyphen is the name of an object
	module that you want removed, and since this is not an actual module
	name, the U2155 error is generated.
	
	A common situation where this error may occur is while installing one
	of the Microsoft language products that build combined libraries
	during the installation process. You may receive the U2155 error when
	running a Setup program if you have specified a directory name during
	setup that contains a hyphen. For example, many C users install the C
	compiler in a directory called MS-C, but Setup then fails when LIB is
	called to build the combined libraries in that directory.
	
	This is expected behavior for LIB.EXE and is the result of the
	established command-line syntax. Unless the command-line syntax is
	changed, the hyphen cannot be recognized as a filespec character
	instead of an operator.
