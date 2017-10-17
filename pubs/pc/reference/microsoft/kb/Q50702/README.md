---
layout: page
title: "Q50702: /PACKCODE Incompatible with IOPL Segments with LINK 5.01.21"
permalink: /pubs/pc/reference/microsoft/kb/Q50702/
---

## Q50702: /PACKCODE Incompatible with IOPL Segments with LINK 5.01.21

	Article: Q50702
	Version(s): 5.01.21
	Operating System: OS/2
	Flags: ENDUSER | S_C
	Last Modified: 10-NOV-1989
	
	LINK Version 5.01.21 does not support the combination of using the
	/PACKCODE switch and having code segments declared as IOPL (i.e., as
	having I/O privilege).
	
	When combining segments as directed by the /PACKCODE option, LINK
	5.01.21 will combine the IOPL segment(s) with other segments that do
	not have I/O privilege. The result is an invalid executable that
	returns the system error SYS1059 when it is invoked.
	
	The lack of ability to combine these options is a limitation of this
	particular linker version. LINK Version 5.03 allows the combination of
	/PACKCODE and IOPL segments without a problem.
