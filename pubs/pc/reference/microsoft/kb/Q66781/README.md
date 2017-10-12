---
layout: page
title: "Q66781: Header Files Do Not Contain Prototypes for C_INIT and C_TERM"
permalink: /pubs/pc/reference/microsoft/kb/Q66781/
---

	Article: Q66781
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 10-NOV-1990
	
	The standard header files shipped with the Microsoft C compilers do
	not contain prototypes for the functions C_INIT() and C_TERM(). These
	functions are called only in specific situations when writing DLLs;
	therefore, they were specifically left out of the header files.
	
	When writing DLLs with Microsoft C, you can write your own
	initialization and termination routines to override the default
	initialization and termination. (This procedure is documented on pages
	395-397 of the "Advanced Programming Techniques" manual shipped with C
	6.00.) To do this, you must make a call in your code to the functions
	C_INIT() and C_TERM(), respectively.
	
	Because these functions are not prototyped anywhere, you must include
	your own prototypes to guarantee the correct calling conventions for
	these functions and to avoid unresolved external errors when linking.
	The correct prototypes are as follows:
	
	   void _far _pascal C_INIT( void );
	   void _far _pascal C_TERM( void );
	
	Note that _far and _pascal must be specified without the underscore if
	you are using C version 5.10.
