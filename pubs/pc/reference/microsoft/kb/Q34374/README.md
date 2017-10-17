---
layout: page
title: "Q34374: LINK /CO /DO in OS/2 Gives Protection Violation"
permalink: /pubs/pc/reference/microsoft/kb/Q34374/
---

## Q34374: LINK /CO /DO in OS/2 Gives Protection Violation

	Article: Q34374
	Version(s): 5.01.21 | 5.01.21
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist5.01.21
	Last Modified: 13-OCT-1988
	
	The Microsoft Segmented Link Utility Version 5.01.21 will
	incorrectly generate a protection violation under OS/2 when the
	command line uses the options /CO /DO, respectively.
	
	OS/2 gives the message SYS1943: "A program caused a protection
	violation." The SYS1811 violation follows, indicating the process has
	stopped.
	
	The work around for this problem is to order the switches differently.
	Instead of including /CO /DO in the command line, the command line can
	be reorder to /DO /CO.
	
	Microsoft has confirmed this to be a problem in Version 5.01.21. We are
	researching this problem and will post new information as it becomes
	available.
