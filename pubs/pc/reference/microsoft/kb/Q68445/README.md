---
layout: page
title: "Q68445: C1001: Internal Compiler Error: regMD.c, Line 1017"
permalink: /pubs/pc/reference/microsoft/kb/Q68445/
---

	Article: Q68445
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 1-FEB-1991
	
	The sample code below will produce the following internal compiler
	error when compiled under C versions 6.00 or 6.00a with default
	optimizations in any memory model:
	
	  test.c(24) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)regMD.c:1.110', line 1017)
	                Contact Microsoft Product Support Services
	
	The following are valid workarounds:
	
	 - Compile with /Od.
	
	 - Compile with /Ox.
	
	 - Use the optimize pragma to turn off optimizations for the function
	   in which the error occurs.
	
	 - Compile with the /qc (Quick Compile) option.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	typedef struct
	{
	  unsigned d : 8;
	  unsigned m : 8;
	} SysDate;
	
	typedef struct
	{
	  unsigned m : 8;
	  unsigned h : 8;
	  unsigned s : 8;
	} SysTime;
	
	extern SysDate fd(void);
	extern SysTime ft(void);
	
	long gotdostime()
	{
	  SysDate dd = fd();
	  SysTime tt = ft();
	  unsigned d = dd.d | (dd.m << 5);
	  unsigned t = tt.h | (tt.m << 5) | (tt.s >> 1);
	
	  return((((long)d) << 16) | t);
	}
