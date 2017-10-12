---
layout: page
title: "Q61605: NODATA and pwords Parameters Reversed in EXPORT Statement Docs"
permalink: /pubs/pc/reference/microsoft/kb/Q61605/
---

	Article: Q61605
	Product: Microsoft C
	Version(s): 5.01.21 5.02 5.03 5.05 5.10 | 5.01.21 5.02 5.03 5.05 5.10
	Operating System: MS-DOS                      | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-MAY-1990
	
	The EXPORT statement used in module definition (.DEF) files is
	incorrectly documented in several places with the last two parameters
	reversed. The "pwords" parameter should be the last parameter, but it
	is listed second from the end. The "NODATA" parameter is listed last,
	but should be second from the end. The correct EXPORT statement syntax
	is as follows:
	
	   entryname [=internalname] [@ord[RESIDENTNAME]] [NODATA] [pwords]
	
	Note that the "pwords" parameter is listed as "iopl-parmwords" in some
	of the documentation.
	
	The documentation with the incorrect EXPORT statement syntax with
	reversed parameters is as follows:
	
	- The C version 6.00 online help for LINK under the EXPORT statement
	  syntax
	
	- On Page 334 of "The Microsoft CodeView and Utilities User's
	  Guide" for version 2.30 in Section 19.9, "The EXPORTS
	  Statement" (shipped with FORTRAN 5.00 and BASIC PDS 7.00)
	
	- On Page Update-52 of "The Microsoft CodeView and Utilities
	  Update" for version 2.20 in Section 7.8, "The EXPORTS
	  Statement" (shipped with C 5.10, MASM 5.10, and Pascal 4.00)
