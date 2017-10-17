---
layout: page
title: "Q68388: &#36;&#36;(@F) Macro Doesn't Work with NMAKE Version 1.01"
permalink: /pubs/pc/reference/microsoft/kb/Q68388/
---

## Q68388: &#36;&#36;(@F) Macro Doesn't Work with NMAKE Version 1.01

	Article: Q68388
	Version(s): 1.01   | 1.01
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.01 fixlist1.11
	Last Modified: 24-JAN-1991
	
	The $$(@F) macro illustrated on page 297 of the "Microsoft FORTRAN
	CodeView and Utilities User's Guide" for version 5.00 will not
	function correctly in NMAKE version 1.01. This has been corrected in
	NMAKE version 1.11, which shipped with Microsoft C version 6.00.
	
	The following is the example from page 297:
	
	DIR=c:\include
	$(DIR)\global.h $(DIR)\types.h $(DIR)\macros.h: $$(@F)
	     !COPY $? $@
	
	With NMAKE version 1.01, this will only work for the first file in the
	list. Subsequent files are not processed. NMAKE 1.11 correctly copies
	all three files to the c:\include directory.
