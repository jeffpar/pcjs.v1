---
layout: page
title: "Q38317: CodeView Gives &quot;Illegal Instruction&quot; on Clone 386"
permalink: /pubs/pc/reference/microsoft/kb/Q38317/
---

	Article: Q38317
	Product: Microsoft C
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER | CV
	Last Modified: 23-NOV-1988
	
	Some clones that are not entirely IBM-compatible under CodeView may
	give an "illegal instruction" message upon executing Go (F5), and then
	hang, requiring a warm boot. If the instruction being called illegal
	is FINIT or FNINIT, the particular ROM BIOS probably has a built-in
	387 emulator. Either turn off the emulator, or set the environment
	variable SET NO87=(some string).
