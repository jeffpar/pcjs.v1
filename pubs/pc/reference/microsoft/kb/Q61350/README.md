---
layout: page
title: "Q61350: Disk vs. RAM Memory of Stand Alone vs. Run Time in BASIC PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q61350/
---

## Q61350: Disk vs. RAM Memory of Stand Alone vs. Run Time in BASIC PDS

	Article: Q61350
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900407-1 docerr
	Last Modified: 15-JAN-1991
	
	There is an apparent contradiction, which needs clarification, at the
	top of page 566 in the "Microsoft BASIC 7.0: Programmer's Guide" for
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10. Page 566 first states, "Stand-alone programs require more
	disk space than those requiring the run-time module." Then it states,
	"Stand-alone programs do have the following advantages, however:
	Stand-alone programs always require less memory than their run-time
	equivalents."
	
	The first statement means to say that one stand-alone program requires
	more disk space than one equivalent run-time program if you do not
	count the size of the run-time module. The second statement means to
	say that stand-alone programs always require less memory in RAM than
	their run-time equivalents (counting the run-time module).
	
	One stand-alone program requires less RAM or disk memory than its
	run-time equivalent if you count the size of the run-time module.
	However, with a large enough number of .EXE programs, the combined
	stand-alone programs require more disk storage space than the combined
	run-time equivalents, which share one run-time module.
