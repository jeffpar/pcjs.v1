---
layout: page
title: "Q67006: C1001: Internal Compiler Error: regMD.c:1.110, line 1017"
permalink: /pubs/pc/reference/microsoft/kb/Q67006/
---

## Q67006: C1001: Internal Compiler Error: regMD.c:1.110, line 1017

	Article: Q67006
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 18-NOV-1990
	
	The sample code below will produce the following internal compiler
	error when compiled with /Oe (global register allocation) or /Ox
	optimization:
	
	   file.c
	   file.c(19) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)regMD.c:1.110', line 1017)
	                Contact Microsoft Product Support Services
	
	This problem appears to be related to the multiple structure member
	assignments. To workaround this problem, simplify statements with
	structure assignments as much as possible, disable global register
	allocation by not using /Oe, or use the #optimize pragma to turn
	global register allocation off for the particular functions where
	problems occur.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	#include <stdlib.h>
	
	typedef struct {
	                 short x0, y0, x1, y1;
	               } BOX;
	
	typedef struct {
	                 long x0, y0, x1, y1;
	               } LONG_RCT;
	
	typedef LONG_RCT  *LONG_RCT_PTR;
	
	LONG_RCT_PTR compute_extent(BOX *bound)
	{
	   static LONG_RCT rct;
	   rct.x0 = (long) min(bound->x0, bound->x1);
	   rct.y0 = (long) min(bound->y0, bound->y1);
	   rct.x1 = (long) max(bound->x0, bound->x1);
	   rct.y1 = (long) max(bound->y0, bound->y1);
	   return(&rct);
	}
