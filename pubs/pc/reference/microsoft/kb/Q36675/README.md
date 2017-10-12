---
layout: page
title: "Q36675: Filename from tmpnam Has Prefix from P_tmpdir"
permalink: /pubs/pc/reference/microsoft/kb/Q36675/
---

	Article: Q36675
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10  | 5.10
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 18-OCT-1988
	
	The tmpnam function generates a temporary filename that can be used as
	a temporary file. The character string that tmpnam creates consists of
	the path prefix defined by the P_tmpdir entry in stdio.h, followed by
	a sequence consisting of the digit characters "0" through "9".
	
	This information is in the "Microsoft C 5.1 Optimizing Compiler
	Run-Time Library Reference" manual on Page 611. The "Microsoft C 4.00
	Run-Time Library Reference" manual does not describe this naming
	behavior.
	
	In Version 5.00 and 5.10, the P_tmpdir entry is defined in stdio.h
	as follows:
	
	#define P_tmpdir "\\"
	
	In Version 4.00, the P_tmpdir entry is defined in stdio.h as follows:
	
	#define P_tmpdir "\\TMP"
	
	Thus, a string for a temporary filename created under Version 4.00
	will have the form \TMP\x (where x is the generated number), and it
	will be necessary to have a TMP subdirectory.
