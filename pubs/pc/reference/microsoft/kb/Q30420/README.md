---
layout: page
title: "Q30420: LOCAL Directive Gives Misleading Error without .MODEL Language"
permalink: /pubs/pc/reference/microsoft/kb/Q30420/
---

## Q30420: LOCAL Directive Gives Misleading Error without .MODEL Language

	Article: Q30420
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The LOCAL directive may give a misleading error message without
	specifying a language on the .MODEL directive.
	   The error message "Extra characters on line" is generated on the
	LOCAL directive in the following code:
	
	.MODEL small
	.code
	main    proc
	        local first:word
	        mov ax,4c00h
	        int 21h
	main    endp
	        end main
	
	   The example will work correctly if you change ".MODEL small" to
	".MODEL small,c'".
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
