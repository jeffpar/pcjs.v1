---
layout: page
title: "Q35249: Correction for MHex&#36; Real Number Format Example"
permalink: /pubs/pc/reference/microsoft/kb/Q35249/
---

## Q35249: Correction for MHex&#36; Real Number Format Example

	Article: Q35249
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 12-DEC-1989
	
	Page 19 in certain copies of the "Microsoft QuickBASIC 4.0: BASIC
	Language Reference" gives four incorrect statements in the source code
	for MHex$. MHex$ is a user-defined FUNCTION that displays the internal
	format for real numbers.
	
	The incorrect statements give an integer overflow message because a
	"multiply by 256" should actually be an "integer divide by 256." The
	correction is shown below.
	
	This documentation error has been corrected in the QuickBASIC 4.50 and
	Microsoft BASIC PDS 7.00 documentation.
	
	The following is the correct text:
	
	line 6: ' --the AND removes unwanted bits; dividing by 256 shifts
	line 7: ' the value right 8 bit positions.
	line 10:    Bytes(I)=AsLong& AND &HFF&
	line 11:    AsLong& \ 256&
	
	This correction is only necessary in certain early copies of the
	manual shipped with QuickBASIC Version 4.00, and is not necessary in a
	later edition of the manual shipped in the Version 4.00 package.
	
	The following is the incorrect text in earlier QuickBASIC Version 4.00
	manuals:
	
	line 6: 'Note that dividing shifts the bytes right, and the AND
	line 7: ' removes unwanted bits.
	line 10:      Bytes(I) = AsLong& \ Shift& AND &HFF&
	line 11:      Shift&=Shift&*256
