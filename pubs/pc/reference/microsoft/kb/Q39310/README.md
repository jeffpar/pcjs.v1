---
layout: page
title: "Q39310: Selective Initialization of Array Elements Not Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q39310/
---

	Article: Q39310
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-DEC-1988
	
	The ANSI C standard does not allow selective initialization of
	array elements with the following syntax:
	
	   char MyArray[10] = {'a','b',,'d',,'f','g',,'i','j'};
	
	This attempt at selective initialization is illegal and will generate
	a "Syntax Error" at compile time. The following two declarations will
	compile and are valid declarations for Microsoft C Version 5.10:
	
	1. The initialization of all the elements of the array is as follows:
	
	   char MyArray[10] = {'a','b','c','d','e','f','g','h','i','j'}
	
	2. The initialization of the front characters in the array is as
	   follows:
	
	   char MyArray[10] = {'a','b','c','d','e'}
