---
layout: page
title: "Q35155: L2001 Fixups without Data"
permalink: /pubs/pc/reference/microsoft/kb/Q35155/
---

## Q35155: L2001 Fixups without Data

	Article: Q35155
	Version(s): 3.65 5.01.21 | 5.01.21
	Operating System: MS-DOS       | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The Link Utility can generate the linker error message L2001:
	fixup(s) without data. In the manual, the linker error is described
	as follows:
	
	A FIXUPP record occurred without a data record immediately
	preceding it. This is probably a compiler error. (See
	the "Microsoft MS-DOS Programmer's Reference" for more information
	on FIXUPP.
	
	In most cases, the error message is generated from an
	assembly-language program that doesn't make sense from the linker's
	point of view, but is convenient for users. The following is an
	example:
	
	    extrn   foo:word
	
	    ABSEG   segment at 123          ; absolute segment
	
	    dw      offset DGROUP:foo       ; offset portion of address of "foo"
	
	    ABSEG   ends
	
	This tells the linker to fix up a location in ABSEG with the address
	of foo. But ABSEG is an absolute segment and has no data to be fixed
	up.
	
	Another example is when you include the same STRUC definitions in both
	absolute and non-absolute segments, so that the STRUC definitions
	contain relocatable addresses.
