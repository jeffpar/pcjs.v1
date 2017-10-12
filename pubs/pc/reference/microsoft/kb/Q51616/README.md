---
layout: page
title: "Q51616: Recursive CL Setting Can Cause D2002 Command-Line Error"
permalink: /pubs/pc/reference/microsoft/kb/Q51616/
---

	Article: Q51616
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-DEC-1989
	
	The command-line error D2002 is produced by the Microsoft C 5.10
	optimizing compiler under certain circumstances when the CL
	environment variable is set recursively.
	
	The following situations cause the error:
	
	   SET CL=CL
	   CL -Ax woof.c           where x is M, C, or L
	
	   SET CL=CL -Ax           where x is M, C, or L
	   CL -Ay woof.c           where y is S, M, C, or L
	
	The error is produced even if -Ax is the same as -Ay in the latter
	case.
	
	D2002 will, of course, also occur when CL is set to a model other than
	the one specified or implied (-AS) on the command line.
	
	The following is the exact text of the error message:
	
	   Command line error D2002 : a previously defined model
	                              specification has been overridden
