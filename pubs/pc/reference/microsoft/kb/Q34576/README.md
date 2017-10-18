---
layout: page
title: "Q34576: MASM 5.10 MACRO.DOC: Memory Control"
permalink: /pubs/pc/reference/microsoft/kb/Q34576/
---

## Q34576: MASM 5.10 MACRO.DOC: Memory Control

	Article: Q34576
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM Version 5.10
	MACRO.DOC file.
	
	MEMORY CONTROL
	
	@FreeBlok (49h)
	
	Frees a block of memory
	
	Syntax:         @FreeBlok [segment]
	
	Argument:       segment     = Starting address of memory to be
	                              freed; if none, ES address assumed
	Return:         If carry set, error code in AX
	Register used:  AX; ES if segment given
	
	@GetBlok (48h)
	
	Allocates a block of memory
	
	Syntax:         @GetBlok paragraphs
	
	Argument:       paragraphs  = Paragraphs (16 bytes) of memory
	wanted
	Return:         AX and ES   = Segment address of allocated
	memory
	                BX          = Paragraphs actually allocated (may be
	                              less than requested if memory is short)
	Register used:  AX and BX
	
	@ModBlok (48h)
	
	Modifies an allocated block of memory
	
	Syntax:         @ModBlok paragraphs [,segment]
	
	Argument:       paragraphs  = Paragraphs (16 bytes) of memory
	wanted
	                segment     = Starting address of memory to be
	freed;
	                              if none, ES address assumed
	Return:         If carry set, error code in AX, else:
	                        ES  = Segment address of allocated memory
	                        BX  = If carry is clear, paragraphs allocated
	Register used:  AX and BX; ES if segment given
