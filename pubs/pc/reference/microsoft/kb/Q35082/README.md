---
layout: page
title: "Q35082: Mouse Versions Prior to New Mouse 1.00 Used MOUSE.SYS"
permalink: /pubs/pc/reference/microsoft/kb/Q35082/
---

	Article: Q35082
	Product: Microsoft C
	Version(s): 1.x 2.x 3.x 4.x 5.x 6.x
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-SEP-1988
	
	Although there is no difference in functionality between the MOUSE.SYS
	and MOUSE.COM drivers, versions prior to the new white-button Version
	1.00 mice used MOUSE.SYS loaded from the CONFIG.SYS rather than the
	MOUSE.COM used via the AUTOEXEC.BAT file.
	
	The MOUSE.COM driver provides greater flexibility in that it is able
	to deallocate from memory and is executable from DOS.
