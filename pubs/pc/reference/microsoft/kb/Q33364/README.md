---
layout: page
title: "Q33364: Small-Memory Model and Far Routines"
permalink: /pubs/pc/reference/microsoft/kb/Q33364/
---

## Q33364: Small-Memory Model and Far Routines

	Article: Q33364
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | 5.10
	Flags: ENDUSER |
	Last Modified: 27-JUL-1988
	
	Question:
	   Is it incorrect to call a routine with a far call in the small
	memory model?
	   When I try to call a C routine with a far call (from assembler),
	the CS register never changes and items start to be executed from the
	current CS instead of the one my routine is at. Are there any rules
	that must be followed to make a far call in the small-memory model?
	
	Response:
	   In order for this to work correctly you need to be sure that the
	function is declared and defined as a far function (e.g. int far foo()).
