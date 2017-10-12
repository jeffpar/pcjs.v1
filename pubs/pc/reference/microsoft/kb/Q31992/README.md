---
layout: page
title: "Q31992: Link Error L1053 Symbol Table Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q31992/
---

	Article: Q31992
	Product: Microsoft C
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 13-OCT-1988
	
	Question:
	
	I am receiving link error L1053: symbol table overflow. What is the
	limit of the symbol table?
	
	Response:
	
	Under MS-DOS, this limit using the DOS-only linker (Versions
	3.x) is dependent on the amount of available memory in your computer.
	LINK can use all conventional memory available under DOS (up to 640K).
	
	Under OS/2, the segmented-executable linker (Versions 5.x and above)
	has no limit on the size of the symbol table because it extends the
	symbol table in virtual memory.
