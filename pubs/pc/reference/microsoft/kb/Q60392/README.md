---
layout: page
title: "Q60392: "
permalink: /pubs/pc/reference/microsoft/kb/Q60392/
---

## Q60392: 

	Article: Q60392
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00 fixlist1.10 s_c
	Last Modified: 5-FEB-1991
	
	TOOLS.PRE is a sample Programmer's WorkBench (PWB) initialization file
	that is installed (and modified) when C 6.00 is installed by running
	the Setup program. On pages 19 and 20 of "Microsoft C: Installing and
	Using the Professional Development System," it states that the
	contents of TOOLS.PRE can be merged with an existing TOOLS.INI file,
	if one exists, or it can be renamed to TOOLS.INI, if there isn't one.
	To work correctly, you must make sure that the contents of this file
	are preceded by a PWB tag (for example, [PWB]) because the supplied
	TOOLS.PRE lacks this tag.
	
	When merging the PWB 1.00 TOOLS.PRE file into an existing TOOLS.INI
	file, a [PWB] tag should be added just above the area where the file
	is merged. For example:
	
	[PWB]
	  .
	  .
	  .
	  (TOOLS.PRE contents)
	  .
	  .
	  .
	
	[NEXT-TAG]
	
	If TOOLS.PRE is being renamed to TOOLS.INI, the tag should be added as
	the first line in the file. In either case, failure to add the tag
	will result in PWB ignoring the initialization information.
	
	Microsoft has confirmed this to be a problem in PWB version 1.00. This
	problem was corrected in PWB version 1.10.
