---
layout: page
title: "Q46774: How Minimum Load Size Is Calculated"
permalink: /pubs/pc/reference/microsoft/kb/Q46774/
---

## Q46774: How Minimum Load Size Is Calculated

	Article: Q46774
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890607-19979
	Last Modified: 13-JUL-1989
	
	The MS-DOS program loader uses the following formula to calculate the
	number of 16-byte paragraphs to use when loading a program:
	
	   TotPages * 20h - NumHeader + 10h + MaxAlloc
	
	The formula calculates the number of 16-byte paragraphs, unless
	there's not enough memory, in which case all the available memory is
	used. If there are not at least
	
	   TotPages * 20h - NumHeader + 10h + MinAlloc
	
	paragraphs available, DOS cannot and will not load the program.
	
	The 20h is the size of a page in paragraphs, which is the size of a
	page (512 bytes) divided by the size of a paragraph (16 bytes).
	
	The 10h is the size in paragraphs of the 256-byte Program Segment
	Prefix that precedes all programs in memory.
	
	All of the values used in the formulae shown above are words (shown in
	the following) that are stored in standard Intel low-byte-first format
	in the .EXE file header:
	
	   Value           Name used by EXEHDR             Offset in .EXE header
	   -----           -------------------             ---------------------
	
	   TotPages        Pages in file                   4 - 5
	   NumHeader       Paragraphs in header            8 - 9
	   MinAlloc        Extra paragraphs needed         0Ah - 0Bh
	   MaxAlloc        Extra paragraphs wanted         0Ch - 0Dh
	
	For more information, refer to a good MS-DOS reference such as the
	"MS-DOS Encyclopedia."
