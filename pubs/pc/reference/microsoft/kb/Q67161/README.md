---
layout: page
title: "Q67161: STARTUP.BAT Gives Error U1073: Don't Know How to Make stdio.h"
permalink: /pubs/pc/reference/microsoft/kb/Q67161/
---

## Q67161: STARTUP.BAT Gives Error U1073: Don't Know How to Make stdio.h

	Article: Q67161
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 29-NOV-1990
	
	When running the batch file STARTUP.BAT that comes with Microsoft C
	versions 6.00 and 6.00a, it is possible to receive the following
	error:
	
	    U1073: don't know how to make 'stdio.h'.
	
	This can be caused by having more than one search path for the INCLUDE
	environment variable, as shown in the following example:
	
	   include=c:\c600\include;c:\masm\include
	
	To correct the problem, only one search path should be used, as in the
	following example:
	
	   include=c:\c600\include
	
	Microsoft has confirmed this to be a problem in the C Compiler
	versions 6.00 and 6.00a. We are researching this problem and will post
	new information here as it becomes available.
