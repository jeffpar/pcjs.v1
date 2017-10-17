---
layout: page
title: "Q11085: Text Mode Problem with Mouse Version 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q11085/
---

## Q11085: Text Mode Problem with Mouse Version 3.00

	Article: Q11085
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 fixlist4.00
	Last Modified: 11-OCT-1988
	
	Question:
	
	Were there any known problems with Hercules graphics support with the
	mouse Version 3.00? When we use the routine reccommended by Hercules
	to get the mouse into graphics mode, we still get a text mouse when we
	use function 0 of the mouse library.
	
	Response:
	
	There is a problem in the mouse driver that is defaulting the text
	cursor to the hardware text cursor, instead of to the software text
	cursor. Microsoft has confirmed this to be a problem in Version 3.00.
	This problem was corrected in Version 4.00.
	
	There are two possible solutions for the problem: use only driver
	Version 4.00 or later, or insert a mouse function 10 call (Set Text
	Cursor) into the beginning of the application program, with the second
	parameter (M2%) set to 0 (select software text cursor).
