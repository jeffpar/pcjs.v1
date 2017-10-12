---
layout: page
title: "Q44131: How to Specify Paths in Inference Rules in NMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q44131/
---

	Article: Q44131
	Product: Microsoft C
	Version(s): 1.00   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc  s_c  h_FORTRAN
	Last Modified: 23-MAR-1990
	
	Question:
	
	How to I specify paths in inference rules?
	
	Response:
	
	Note: For a complete description of this feature, see QuickC Version 2.00
	Toolkit, Section 7.3.3. One of the most powerful new features of
	NMAKE is that it allows paths to be specified in an inference rule.
	
	The syntax of an inference rule without paths is as follows:
	
	   .fromext.toext:
	
	This syntax is somewhat limited, however, because both the "fromfile"
	and the "tofile" are evaluated as if they existed in the current
	directory. With NMAKE, a path specifier may be added to an inference
	rule by doing the following:
	
	   {frompath}.fromext{topath}.toext:
	
	Note: If you use a path on one element of the inference rule, you must
	use it on both. For instance, if you want to compare any .c file in
	the current directory with its .obj file in my object directory, the
	inference rule would look like the following:
	
	{.}.c{c:\objects}.obj:
	        cl /c $<;
	
	Note that the fromext (.c) has to be preceded with a path. In the case
	of the current directory, the ".", or current directory works nicely.
	
	When NMAKE encounters a descriptor block that has no commands
	following, it will look for an inference rule that matches the
	descriptor block. When checking for matching, NMAKE expects that the
	base name of both the target and the dependents be the same. Also, the
	paths must match exactly. In other words, the following descriptor
	line would not use the inference rule just defined because the paths
	do not match on the .obj file:
	
	   test.obj : test.c
	
	In this case, the predefined inference rule for .c.obj: would be
	invoked. To invoke the inference rule just defined, the descriptor
	line would be as follows:
	
	   c:\objects\test.obj : test.c
