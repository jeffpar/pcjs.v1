---
layout: page
title: "Q31986: Maximum Libraries LINK Can Handle"
permalink: /pubs/pc/reference/microsoft/kb/Q31986/
---

## Q31986: Maximum Libraries LINK Can Handle

	Article: Q31986
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-OCT-1988
	
	LINK can handle no more than 32 libraries, i.e., on the LIBRARY
	prompt, you can specify up to 32 libraries.
	   If you have more libraries, you have two choices: combine libraries
	or specify some of them at the object modules prompt. In the second
	case, LINK will treat the library as a collection of object modules,
	all of which should be included in your .EXE file.
