---
layout: page
title: "Q57233: C 5.1 Run-Time Reference Example for atan2() Is Missing ")""
permalink: /pubs/pc/reference/microsoft/kb/Q57233/
---

	Article: Q57233
	Product: Microsoft C
	Version(s): 5.10    | 5.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 15-JAN-1990
	
	On Page 123 in the "Microsoft C 5.1 Optimizing Compiler Run-Time
	Library Reference," there is a right parenthesis missing in the last
	line of the example program for the atan() and atan2() functions. The
	line should read as follows:
	
	   printf("%.7f\n",atan2(-1.0,1.0));
