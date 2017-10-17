---
layout: page
title: "Q69237: _bheapseg: Return Value Documented Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q69237/
---

## Q69237: _bheapseg: Return Value Documented Incorrectly

	Article: Q69237
	Version(s): 6.00 6.00a  | 6.00 6.00a
	Operating System: MS-DOS      | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-FEB-1991
	
	The return value for the _bheapseg function is documented incorrectly
	on page 147 of the "Microsoft C Reference," in the online help for C
	6.00, and in the online help for QuickC versions 2.50 and 2.51.
	
	On page 147 of the "Microsoft C Reference," the line that reads
	
	   Returns     The selector for the newly allocated segment
	               if successful; -1 if not.
	
	should read as follows:
	
	   Returns     The selector for the newly allocated segment
	               if successful; 0 (_NULLSEG) if not.
	
	The online help mentions the correct return value for the _bheapseg
	function in the "Summary" section, except that it specifies NULLSEG
	instead of _NULLSEG. The paragraph in the "Description" section titled
	"Return Value" incorrectly documents the return value as -1.
