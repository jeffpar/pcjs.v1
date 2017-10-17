---
layout: page
title: "Q30959: chdir() Example Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q30959/
---

## Q30959: chdir() Example Is Incorrect

	Article: Q30959
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The example of the chdir() function on Page 156 of the "Microsoft C
	Run-Time Library Reference" manual is incorrect. This example is
	missing double quotation marks around the path. It should read as
	follows:
	
	chdir("c:\\temp") ;
