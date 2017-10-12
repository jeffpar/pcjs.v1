---
layout: page
title: "Q42072: Incorrect Usage of /o Switch in "Peter Norton's Inside OS/2""
permalink: /pubs/pc/reference/microsoft/kb/Q42072/
---

	Article: Q42072
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | docerr
	Last Modified: 16-MAY-1989
	
	"Peter Norton's Inside OS/2" book written by Peter Norton and Robert
	Lafore, published by Brady, contains examples of OS/2 programming that
	were written and compiled using the Microsoft C Optimizing compiler
	Version 5.10. Page 536 of the book states the following:
	
	   The -o option prevents the compiler from thinking that the global
	   variables have been defined more than once.
	
	This is incorrect. The /o option is an undocumented compiler switch
	that allows you to name the executable file. It is the same as the /Fe
	compiler switch.
