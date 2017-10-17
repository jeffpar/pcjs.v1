---
layout: page
title: "Q61328: Why C 6.00 Doesn't Contain DOS Versions of C2L and C3L"
permalink: /pubs/pc/reference/microsoft/kb/Q61328/
---

## Q61328: Why C 6.00 Doesn't Contain DOS Versions of C2L and C3L

	Article: Q61328
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-JUN-1990
	
	The alternate second and third passes of the Microsoft C version 6.00
	compiler have a much larger pass size (the amount of memory taken up
	in code and overhead for a pass of the compiler) than their
	small-model counterparts.
	
	This larger pass size negates any net memory gain under DOS that is
	made in not restricting data to DGROUP. Because of this fact, the
	alternate second and third passes of the compiler for DOS were not
	shipped with the Microsoft C version 6.00 package.
	
	The compiler message "Out of Near Heap Space" may be encountered in
	pass two of the CL.EXE compiler when compiling moderate to large size
	modules under DOS. The solution for this problem is to either reduce
	the number of symbols in your module, reduce the size of the module,
	or switch to the OS/2 operating system where there are alternate
	second and third pass compilers to handle this situation.
