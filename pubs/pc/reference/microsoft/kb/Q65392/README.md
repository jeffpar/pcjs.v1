---
layout: page
title: "Q65392: Cannot Initialize Union Containing Nameless Struct Member"
permalink: /pubs/pc/reference/microsoft/kb/Q65392/
---

	Article: Q65392
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	Initializing a union containing a nameless struct as one of its
	members will cause the following compiler errors:
	
	   error C2097:   illegal initialization
	
	   error C2078:   too many initializers
	
	The sample code shown below reproduces the problem:
	
	union
	{
	   struct
	   {
	      int a;
	      int b;
	   };            // Add a name here to allow initialization
	   long c;
	} x = { { 0,0 } };
	
	The only workarounds available are to either name the struct or to
	leave the union uninitialized.
	
	Microsoft has confirmed this to be a problem with Microsoft C version
	6.00. We are researching this problem and will post new information
	here as it becomes available.
