---
layout: page
title: "Q41689: Documentation on Global Variable _osversion Is Incomplete"
permalink: /pubs/pc/reference/microsoft/kb/Q41689/
---

	Article: Q41689
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	Page 36 of the "Microsoft C 5.10 Optimizing Compiler Run-Time Library
	Reference" states the global variable _osversion "provides the
	complete version number" of DOS the program is running under. This
	information is correct, but the format of _osversion is not mentioned.
	
	The high-order byte of _osversion is the "minor" version number, or
	_osminor. The low-order byte is the "major" version number, or
	_osmajor.
	
	If you were to write out these values in hex on a system running DOS
	Version 3.30 your output would be as follows:
	
	   _osversion = 1e03
	   _osminor   = 1e    (30 in decimal)
	   _osmajor   = 03
	
	See the C run-time library reference guide, Page 36 for more
	information.
