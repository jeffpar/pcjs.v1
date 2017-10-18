---
layout: page
title: "Q30378: Structure Prototype Allowed to be Referenced in Program"
permalink: /pubs/pc/reference/microsoft/kb/Q30378/
---

## Q30378: Structure Prototype Allowed to be Referenced in Program

	Article: Q30378
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The following code defines a structure-type "mouse", but does not
	declare "mouse" as a location or instance of the structure:
	
	        .MODEL SMALL
	   mouse struc
	
	   cat  dw  11
	   dog  dw  12
	
	   mouse ends
	       .DATA
	   duck    mouse   <>
	       .CODE
	   start: mov ax,@data
	          mov ds,ax
	          mov ax,mouse.dog
	
	   END start
	
	   The assembler allows access to the structure. The line "mov ax,
	mouse.dog" generates the following:
	
	   mov ax,2
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
