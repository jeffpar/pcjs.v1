---
layout: page
title: "Q36885: CVP Accessing I/O Ports"
permalink: /pubs/pc/reference/microsoft/kb/Q36885/
---

	Article: Q36885
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER | buglist2.20 buglist2.30
	Last Modified: 14-AUG-1989
	
	In the "Microsoft CodeView and Utilities Software Development Tools
	for the MS-DOS Operating System," Sections 6.6 and 10.5 discuss the
	Port Input and Port Output commands respectively. These commands
	function correctly in CV under MS-DOS. However, CVP under OS/2
	generates a protection violation when trying to access a port. The
	port input and output commands do not function in CVP Version 2.20
	under OS/2.
	
	Microsoft has confirmed this to be a problem in Version 2.20. We are
	researching this problem and will post new information as it becomes
	available.
