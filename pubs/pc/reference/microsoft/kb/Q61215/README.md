---
layout: page
title: "Q61215: C 6.00 README: SHIFT+ALT, SHIFT+CTRL Different in DOS and OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q61215/
---

	Article: Q61215
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	SHIFT+ALT, SHIFT+CTRL Different in DOS and OS/2
	-----------------------------------------------
	
	PWB handles the SHIFT+ALT and SHIFT+CTRL key assignments differently
	depending on whether you are running in DOS or OS/2. In DOS, a key
	sequence beginning with SHIFT+ALT or SHIFT+CTRL only recognizes the
	unshifted value of the third key:
	
	   SHIFT+CTRL+<unshifted_character>
	   SHIFT+ALT+<unshifted_character>
	
	In OS/2, however, this key combination requires the shifted  version
	of the key to work correctly:
	
	   SHIFT+CTRL+<shifted_character>
	   SHIFT+ALT+<shifted_character>
