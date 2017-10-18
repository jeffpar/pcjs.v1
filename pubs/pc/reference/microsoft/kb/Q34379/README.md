---
layout: page
title: "Q34379: Making Multiple Initialized Far Data Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q34379/
---

## Q34379: Making Multiple Initialized Far Data Segments

	Article: Q34379
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Questions:
	   How can I make multiple initialized far data segments with the
	Macro Assembler Version 5.00 or 5.10?
	
	Response:
	   You can have multiple initialized far-data segments by using the
	.fardata Segment_Name directive, as documented on Page 88 of the
	"Microsoft Macro Assembler 5.1 Programmers Guide."
	   The sample program below demonstrates using two intialized far-data
	segments. The program size is very large (131k) due to the large
	amount of data that is being stored.
	   The following is the sample program:
	
	; The contents of SrcBuff will be copied to DesBuff
	         .model large
	         .fardata
	SrcBuff  db    65535 dup (65)      ; First Initialized far segment
	
	         .fardata BufSeg           ; Name 2nd fardata segment BufSeg
	DestBuff db    65535 dup (66)
	
	         .code
	main:
	         mov  ax, @fardata         ; Make ds:si point to SrcBuff
	         mov  ds, ax
	         mov  si, 0
	
	         mov  ax, BufSeg           ; Make es:di point to DestBuff
	         mov  es, ax
	         mov  di, 0
	
	         mov  cx, 0ffffh           ; Initialize full segment
	
	         rep  movsb                ; Automatically inc si & di
	                                   ; Dec cx till 0
	         retf
	         end  main
