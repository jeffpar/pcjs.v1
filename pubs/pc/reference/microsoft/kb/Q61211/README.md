---
layout: page
title: "Q61211: C 6.00 README: PWB Run Command Line Cannot Contain $ or ^"
permalink: /pubs/pc/reference/microsoft/kb/Q61211/
---

	Article: Q61211
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	PWB Run Command Line Cannot Contain $ or ^
	------------------------------------------
	
	The Command Line option on the Run menu in PWB cannot contain
	characters that have special meaning for NMAKE. In particular, you
	should not use the caret (^) or the dollar sign ($) in command lines
	that are passed to your application by PWB.
