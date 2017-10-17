---
layout: page
title: "Q50732: No Compiler Errors Produced When Assigning to Missing struct"
permalink: /pubs/pc/reference/microsoft/kb/Q50732/
---

## Q50732: No Compiler Errors Produced When Assigning to Missing struct

	Article: Q50732
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	Code that assigns a value to a nonexistent structure compiles without
	warning or error in Microsoft C 5.10 and QuickC Versions 2.00 and
	2.01. This is correct behavior.
	
	Note that dereferencing a pointer to an undefined structure, or
	attempting to use a field will produce errors. In general, you are
	allowed to make a reference to an undefined struct as long as the
	operation doesn't have to know the size of that struct or the names of
	its fields. This method of declaration is commonly used in linked
	lists.
	
	void main (void)
	{
	   struct non_existant *ptr;             // legal
	   struct x{
	            struct x *previous;          // legal, note that struct x is
	            struct x *next;              // not yet defined
	           }
	                .
	                .
	                .
	                .
	}
