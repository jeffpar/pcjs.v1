---
layout: page
title: "Q34372: Unresolved Externals Link Errors for OS/2 Calls"
permalink: /pubs/pc/reference/microsoft/kb/Q34372/
---

	Article: Q34372
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	Question:
	
	Why do I get unresolved externals for all of my API calls when I link
	object files produced by the C Version 5.10 compiler?
	
	Response:
	
	You can control the OS/2 files to include by defining certain symbols
	in your source code. A few of the more common ones are listed below:
	
	#define INCL_BASE        /*  all OS/2 base definitions        */
	#define INCL_DOS         /*  OS/2 DOS kernel                  */
	#define INCL_SUB         /*  VIO, keyboard, mouse functions   */
	#define INCL_DOSERRORS   /*  OS/2 errors                      */
	
	One or more of the above definitions should be followed by the
	following:
	
	#include <os2.h>
	
	The above #defines and #include preprocessor directives will start a
	chain reaction of #defines and #includes that will define the API
	functions in the respective categories of functions. You can follow
	this series to determine the minimum prototypes required for the API
	functions called by your application.
	
	If the proper constant is not defined in your source code above the
	line where you include OS2.H, there will be no prototypes for API
	functions.
	
	All of the API functions must be declared with the Pascal calling
	convention. If there are no prototypes to tell the compiler to use the
	Pascal calling convention, the compiler will use the default C calling
	convention. The C calling convention will place an underscore (_) in
	front of each function called; therefore, each function will be
	incorrectly named, resulting in unresolved externals at link time. The
	Pascal calling convention does not place an underscore in front of
	each function, so if the correct prototypes are given, the linker will
	resolve all of the references to the API functions in the DOSCALLS.LIB
	library.
	
	This information is documented in the README.DOC file that comes with
	Microsoft C Version 5.10.
