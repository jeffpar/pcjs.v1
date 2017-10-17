---
layout: page
title: "Q65396: EOF in 7.00 Returns &quot;Nonzero&quot; for TRUE, But 4.50 Returns -1"
permalink: /pubs/pc/reference/microsoft/kb/Q65396/
---

## Q65396: EOF in 7.00 Returns &quot;Nonzero&quot; for TRUE, But 4.50 Returns -1

	Article: Q65396
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900822-29 B_QuickBas
	Last Modified: 4-SEP-1990
	
	The EOF function has changed slightly from QuickBASIC versions 4.50
	and earlier to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and later. In QuickBASIC, the EOF function will return 0
	(zero) for FALSE and -1 for TRUE. In BASIC PDS 7.00, EOF still returns
	0 for FALSE, but it returns "nonzero" for TRUE. This means that EOF
	will return a positive or negative number other than 0 if the end of
	the file has been reached or if you are at the "end" of an ISAM table.
	Previous QuickBASIC programs that hard coded a check for -1 will have
	to be changed to check for a nonzero value. Since 0 is equivalent to
	FALSE and nonzero evaluates to TRUE in BASIC, this is an easy change
	to make. For instance, you do not need to check "IF EOF = -1 THEN
	GOSUB foo"; instead, you can use "IF EOF THEN GOSUB foo". This second
	check will work in any version of Microsoft BASIC.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2. This
	article documents a change from Microsoft QuickBASIC 1.00, 1.01, 1.02,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, and from Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2.
