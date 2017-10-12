---
layout: page
title: "Q63624: Parenthesis in Filename May Cause L1027: Unmatched Parenthesis"
permalink: /pubs/pc/reference/microsoft/kb/Q63624/
---

	Article: Q63624
	Product: Microsoft C
	Version(s): 3.x 4.06 4.07 5.01.21 5.03 5.05 5.10 | 5.01.21 5.03 5.05
	Operating System: MS-DOS                               | OS/2
	Flags: ENDUSER |
	Last Modified: 10-JUL-1990
	
	When linking object files into executable programs, the error L1027:
	"Unmatched left/right parenthesis" may be incorrectly generated for
	files that contain a parenthesis in the filename. This will only occur
	when the object module is in the current directory and either of the
	following conditions is true:
	
	1. If the object module being linked has a left parenthesis as the
	   first character in its name, but NOT a right parenthesis as the last
	   character.
	
	2. If an object filename has a right parenthesis as the last
	   character in the name, but NOT a left parenthesis as the first.
	
	If the object module is NOT in the current directory, then the L1027
	error will occur only if the second condition above is true.
	
	This information applies to all versions of LINK.EXE that support
	overlays.
	
	Normally, parentheses are put around the names of one or more object
	modules when linking to inform LINK that the enclosed modules are to
	be in an overlay. Therefore, if a left (or right) parenthesis comes
	immediately before (or after) the name of an object module, LINK will
	expect a right (or left) parenthesis immediately after (or before) the
	name. If the parentheses do not match, a fatal L1027 error will be
	generated.
	
	For example, the following LINK command line causes an "Unmatched left
	parenthesis" error when the object module ABC.OBJ is in the current
	directory:
	
	   link (abc;
	
	However, if ABC.OBJ is in a subdirectory, then the parenthesis is
	embedded in the middle of the path/filename string and no error is
	generated, as shown below:
	
	   link temp\(abc;
	
	For the same reason, a file ABC).OBJ will NOT give an error if linked
	with the following line:
	
	   link abc).obj;
	
	On the other hand, leaving off the .OBJ extension will result in the
	L1027 error:
	
	   link abc);
	
	By the same reasoning, the placement of a left or right parenthesis in
	the middle of an object filename does not cause an error. The
	following three LINK lines all work correctly:
	
	   link a(bc;
	   link a()bc;
	   link a)bc;
