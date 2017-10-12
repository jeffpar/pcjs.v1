---
layout: page
title: "Q44754: &quot;longjmp&quot; Incorrectly Spelled &quot;longjump&quot; in QC Advisor Help"
permalink: /pubs/pc/reference/microsoft/kb/Q44754/
---

	Article: Q44754
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 25-MAY-1989
	
	The QuickC Version 2.00 on-line help system misspells the longjmp()
	function in one location as "longjump". Selecting the word from this
	location will not produce the help screen for longjmp().
	
	The misspelling occurs on the screen that can be reached with the
	following sequence of help selections:
	
	    Help -> Contents -> Functions -> Miscellaneous
	
	The function name appears to be spelled correctly in every other case,
	and requests for help on "longjmp" while in the Edit Window function
	perform as expected.
