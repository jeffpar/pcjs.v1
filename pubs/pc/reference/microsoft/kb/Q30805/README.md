---
layout: page
title: "Q30805: MASM 5.10 OS2.DOC: OS/2 Call Summary - Segment Information"
permalink: /pubs/pc/reference/microsoft/kb/Q30805/
---

## Q30805: MASM 5.10 OS2.DOC: OS/2 Call Summary - Segment Information

	Article: Q30805
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Information segment constant - INCL_DOSPROCESS
	
	   @DosGetInfoSeg - Returns the addresses of the global and local segment
	   Parameters - GlobalSeg:PW, LocalSeg:PW
	   Structures - The returned segments contain the addresses of the GINFOSEG
	                and LINFOSEG structures
