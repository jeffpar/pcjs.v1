---
layout: page
title: "Q30380: Text Macros Cannot Serve as Data-Definition Replacements"
permalink: /pubs/pc/reference/microsoft/kb/Q30380/
---

## Q30380: Text Macros Cannot Serve as Data-Definition Replacements

	Article: Q30380
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	A text macro cannot be used to select data-definition directives.
	The following program demonstrates this problem:
	
	    .MODEL SMALL
	    .CODE
	start: mov ax,@data
	       mov ds,ax
	
	gets   equ   <DW>
	boat   gets   3
	    END start
	
	 More Information:
	   The following assembler error message is generated on the "boat
	gets 3" line:
	
	   A2105 Expected: instruction, directive, or label
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
