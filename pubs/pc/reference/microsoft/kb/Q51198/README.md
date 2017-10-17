---
layout: page
title: "Q51198: Formal Parameters Default to Type int"
permalink: /pubs/pc/reference/microsoft/kb/Q51198/
---

## Q51198: Formal Parameters Default to Type int

	Article: Q51198
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 30-NOV-1989
	
	Question:
	
	Why doesn't the compiler generate an error for the following code?
	
	   void main (voida)
	   {
	   }
	
	The variable "voida" is not referenced.
	
	Response:
	
	The C and QuickC compilers don't generate an error because the
	variable "voida" defaults to a variable of type int. The compilers
	understand the above function definition since they recognize the "old
	style" of ANSI C declarations as well as the new. In general, the
	equivalents of the above code are as follows:
	
	   Old Style                           New Style
	   ---------                           ---------
	
	   void function (voida)               void function (int voida)
	   int voida  <- default if missing    {
	   {                                   }
	   }
	
	Please refer to "The C Programming Language" by Brian Kernighan and
	Dennis Ritchie for a discussion on differences between old and new
	style with regards to function definition.
