---
layout: page
title: "Q65817: ILINK 1.20 and 1.21 Are Not Backwards Compatible"
permalink: /pubs/pc/reference/microsoft/kb/Q65817/
---

## Q65817: ILINK 1.20 and 1.21 Are Not Backwards Compatible

	Article: Q65817
	Version(s): 1.20 1.21 | 1.20 1.21
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	Using ILINK version 1.20 or 1.21, after doing a full link using a
	bound linker earlier than version 5.10 or a DOS linker earlier than
	version 4.10, causes the following message:
	
	   ILINK : warning L4267: invalid .ILK file
	   ILINK : performing full link
	
	If you use the ILINK version that came with the linker you are using,
	the .ILK file will be recognized correctly. ILINK versions 1.20 and
	1.21 are not "backwards compatible" and will not work correctly with
	earlier .ILK files.
