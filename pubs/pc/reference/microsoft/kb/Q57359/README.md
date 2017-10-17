---
layout: page
title: "Q57359: Use &quot;proc uses&quot;, Not &quot;procuses&quot; in MASM Example; BASIC 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q57359/
---

## Q57359: Use &quot;proc uses&quot;, Not &quot;procuses&quot; in MASM Example; BASIC 7.10

	Article: Q57359
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S891226-4 docerr
	Last Modified: 8-JAN-1991
	
	On Page 495 of the "Microsoft BASIC 7.0: Programmer's Guide" (for 7.00
	and 7.10), a space should appear between the assembly code "proc" and
	"uses", but the manual shows no space between them.
	
	The following is incorrect:
	
	   addstring  procuses si di ds,s1:far ptr,s1len,s2:far ptr,s2len
	
	The following is correct:
	
	   addstring  proc uses si di sd,s1:far ptr,s1len,s2:far ptr,s2len
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
