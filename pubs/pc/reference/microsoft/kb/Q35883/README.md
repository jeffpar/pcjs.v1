---
layout: page
title: "Q35883: Public Labels Are Prefixed with Underscore Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q35883/
---

## Q35883: Public Labels Are Prefixed with Underscore Incorrectly

	Article: Q35883
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 20-NOV-1990
	
	When you assemble the following program with MASM Version 5.10 and
	examine the public labels, you will find an underscore prefixed to the
	public labels. The structure declaration is the cause of the problem.
	The problem is related to the space before the comma in the structure
	initialization. MASM wasn't skipping it, causing a host of problems.
	
	The workaround to this problem is to remove the space.
	
	Another symptom of the problem occurs during link-time, the linker
	generates unresolved externals for all public labels with underscores
	prefixed.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following sample code demonstrates the problem:
	
	;*******************************************************************
	FooStruc STRUC
	Label1      db      "LPT"
	Label2      db      ?
	            db      "    "
	FooStruc ENDS
	
	DSEG SEGMENT
	FooData1 FooStruc < , "1">
	FooData2 FooStruc < , "2">
	DSEG ENDS
	
	CSEG SEGMENT
	    ASSUME CS:CSEG, DS:DSEG
	
	PUBLIC FooProc
	FooProc PROC NEAR
	
	        mov     ax, OFFSET DSEG:FooData2
	
	FooProc ENDP
	
	CSEG ENDS
	
	        END
	;*************************************************************
