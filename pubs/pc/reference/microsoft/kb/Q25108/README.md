---
layout: page
title: "Q25108: Using LIB to Combine Two Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q25108/
---

## Q25108: Using LIB to Combine Two Libraries

	Article: Q25108
	Version(s): 3.00 3.04 3.07 3.08 3.10 3.11 3.14 3.17 | 3.11 3.14 3.17
	Operating System: MS-DOS                                  | OS/2
	Flags: ENDUSER | s_lib
	Last Modified: 15-JAN-1991
	
	The Microsoft Library Manager utility (LIB.EXE) can be used to combine
	two libraries into one.
	
	The following is an example of how to add the contents of LIB1.LIB to
	LIB2.LIB in a single LIB command:
	
	   LIB LIB2.LIB+LIB1.LIB;
	
	You may also have LIB prompt you for input, in which case the input
	and prompts will appear as follows:
	
	LIB <RETURN>
	Library name: LIB2.LIB <RETURN>
	Operations: +LIB1.LIB <RETURN>
	
	Note that the .LIB extension is required; otherwise, LIB will assume
	LIB1 is an object module.
