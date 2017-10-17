---
layout: page
title: "Q32228: Loading a TAGGED Section Reinitializes the Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q32228/
---

## Q32228: Loading a TAGGED Section Reinitializes the Editor

	Article: Q32228
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00 tar76973
	Last Modified: 29-AUG-1988
	
	When a TAGGED section is initialized (<arg> "section name"
	<initialize>), all current macros are destroyed before
	reinitialization.
	
	The curdate, curtime, etc., macros are reset, your extmake: settings
	are set to the default, and the OS-dependent and video-dependent
	sections of TOOLS.INI are read in. If you type <initialize>, the main
	section is read in place of the TAGGED section.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We
	are researching this problem and will post new information as it
	becomes available.
