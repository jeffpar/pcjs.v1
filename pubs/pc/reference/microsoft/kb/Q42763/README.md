---
layout: page
title: "Q42763: Copy Is a Reserved Word"
permalink: /pubs/pc/reference/microsoft/kb/Q42763/
---

	Article: Q42763
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	The word copy is a reserved word in the Microsoft Editor. If you write
	an M extension and name it "copy", the editor will load but not
	execute your extension.
	
	If you name the function (for example) cpy rather than copy, it will
	work correctly.
	
	The following declaration incorrectly uses the reserved word "copy."
	Renaming the the function "cpy" will resolve the problem:
	
	flagType pascal EXTERNAL copy (argData, Parg, fMeta)
	unsigned int argData;
	ARG far *Parg;
	flagType fMeta;
