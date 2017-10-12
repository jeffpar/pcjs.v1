---
layout: page
title: "Q67781: C1001: Internal Compiler Error: grammar.c, Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q67781/
---

	Article: Q67781
	Product: Microsoft C
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 31-JAN-1991
	
	The C version 6.00a compiler produces the following internal compiler
	error when the sample program below is compiled the /Ox or /Oe
	optimizations:
	
	   foo.c(9):fatal error C1001:Internal Compiler Error
	       (compiler file '../grammar.c', line 140)
	       Contact Microsoft Product Support Services
	
	The following are valid workarounds for this problem:
	
	1. Compile with any optimization not containing /Oe.
	
	2. Disable the "e" optimization using the optimize pragma.
	
	Sample Code
	-----------
	
	1  typedef struct utype { char bitmap[10]; } Utype;
	2  extern Utype utypes[];
	3
	4  void InitializeBitmaps(void)
	5  {
	6     int cnt,cnt2;
	7     for(cnt=0;cnt<13;cnt++)
	8       for(cnt2=0;cnt2<10;cnt2++)
	9          utypes[cnt].bitmap[cnt2]=(char)~utypes[cnt].bitmap[cnt2];
	10 }
	
	Microsoft has confirmed this to be a problem in Microsoft C version
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
