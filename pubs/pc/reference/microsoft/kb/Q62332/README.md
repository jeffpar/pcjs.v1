---
layout: page
title: "Q62332: Can't Use Multiple Description Blocks with NMAKE Version 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q62332/
---

## Q62332: Can't Use Multiple Description Blocks with NMAKE Version 1.10

	Article: Q62332
	Version(s): 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.10 fixlist1.11 b_basiccom
	Last Modified: 25-JUL-1990
	
	Page 639 of "Microsoft BASIC 7.0: Programmer's Guide" explains how you
	can use NMAKE to specify more than one description block for the same
	target.
	
	The example given on this page is the proper way to specify more than
	one description block; however, this feature does not function
	correctly in NMAKE version 1.10. It does function correctly in NMAKE
	version 1.11.
	
	NMAKE version 1.10 shipped with the Professional Development System
	(PDS) BASIC version 7.00. NMAKE version 1.11 shipped with Microsoft C
	Professional Development System (PDS) version 6.00.
	
	The following example specifies more than one description block for
	the same target by using two colons (::) as the separator instead of
	one. The following example is taken from Page 639 of "Microsoft BASIC
	7.0: Programmer's Guide":
	
	      TARGET.LIB :: A.ASM B.ASM C.ASM
	         MASM A.ASM B.ASM C.ASM;
	         LIB TARGET -+A.OBJ -+B.OBJ -+C.OBJ;
	      TARGET.LIB :: D.BAS E.BAS
	         BC D.BAS;
	         BC E.BAS;
	         LINK D.OBJ E.OBJ;
	         LIB TARGET -+D.OBJ -+E.OBJ;
	
	Given the two description blocks above, NMAKE should update the
	library named TARGET.LIB. In the first description block, if any of
	the assembly language files have changed more recently than the
	library, the assembly files will be assembled and the library will be
	updated with the new .OBJs. In the second description block, the BASIC
	files that have changed should be compiled and the library should also
	be updated with the new OBJs.
	
	When using NMAKE version 1.10, the commands in the first description
	block are executed correctly; however, the commands in the second
	description block are never executed.
	
	Microsoft has confirmed this to be a problem in NMAKE version 1.10.
	This problem was corrected in version 1.11.
