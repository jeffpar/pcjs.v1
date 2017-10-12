---
layout: page
title: "Q43045: CL Environment Variable in QuickC Err Msg: Object Not Found"
permalink: /pubs/pc/reference/microsoft/kb/Q43045/
---

	Article: Q43045
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Including the /c on your CL environment variable when compiling inside
	the QuickC Version 2.00 environment can cause the following error
	message:
	
	L1093 : SOURCE.OBJ : object not found
	
	This problem can be corrected by removing the /c from the CL
	environment variable and erasing the .OBJ file which the compiler has
	generated for the source program.
	
	Oddly enough, this option will not cause a problem unless it is
	followed by another valid option, i.e., cl=/c will not cause the link
	failure.
	
	The CL environment variable is used by CL.EXE and QCL.EXE for setting
	default compiler options. While working inside the QuickC 2.00
	environment, it is a good idea to be conscious of which environment
	variables are set by CL.
	
	Utilizing the CL environment variable usually facilitates programming
	within the QuickC 2.00 environment. For example, the following line
	will tell the QuickC compiler to always use the coprocessor library:
	
	SET CL=/FPi87
	
	This can be very useful for programming inside the QuickC environment
	as well as outside of it.
