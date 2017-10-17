---
layout: page
title: "Q64792: Helpmake Version 1.05 May Not Decode All Formatting"
permalink: /pubs/pc/reference/microsoft/kb/Q64792/
---

## Q64792: Helpmake Version 1.05 May Not Decode All Formatting

	Article: Q64792
	Version(s): 1.05   | 1.05
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_helpmake buglist1.05 fixlist1.06
	Last Modified: 23-JAN-1991
	
	HELPMAKE version 1.05 (shipped with Microsoft C version 6.00) does not
	decode all formatting information in help files decoded with the /D
	option. HELPMAKE version 1.03 (shipped with the OS/2 1.20 SDK) works
	as expected.
	
	This lack of decoding will result in no bold, green, italic, or
	underline formatting in help files that are compressed again with
	HELPMAKE.
	
	Microsoft has confirmed this to be a problem in HELPMAKE version 1.05.
	This problem was corrected in HELPMAKE version 1.06. HELPMAKE 1.06 was
	shipped with the Microsoft Advisor Library.
	
	Example
	-------
	
	The "\i" and "\p" options are not decoded in the sample below. This
	excerpt is from PWB 1.00 version of the PWB.HLP file.
	
	Note: Nonprintable characters are removed from these examples.
	
	From HELPMAKE version 1.03:
	
	   +------- Browse Menu ---------+
	   | \i\a\pGoto Definition...\v@L8001\v\i\p | Finds definition of symbol
	
	From HELPMAKE version 1.05:
	
	   +------- Browse Menu ---------+
	   | \aGoto Definition...\v@L8001\v | Finds definition of symbol
