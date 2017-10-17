---
layout: page
title: "Q57931: EXE Does Nothing If BC.EXE Compiled from GW-BASIC Binary Code"
permalink: /pubs/pc/reference/microsoft/kb/Q57931/
---

## Q57931: EXE Does Nothing If BC.EXE Compiled from GW-BASIC Binary Code

	Article: Q57931
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	Programs saved in the Binary (the default tokenized) format in the
	GW-BASIC or BASICA Interpreter will appear to compile in BC.EXE and
	LINK into an .EXE program without error in the BASIC compilers listed
	further below. However, the resulting .EXE file created from a Binary
	GW-BASIC or BASICA source program does nothing when run -- it just
	drops back to DOS.
	
	The BC.EXE compiler fails to abort and give an error message when you
	mistakenly give it GW-BASIC or BASICA Binary files. Microsoft has
	confirmed this to be a problem in Microsoft BASIC Compiler versions
	6.00 and 6.00b; in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10; and in Microsoft QuickBASIC versions
	4.00, 4.00b, and 4.50 (buglist4.00, buglist4.00b, buglist4.50). We are
	researching this problem and will post new information here as it
	becomes available.
	
	To correctly create an EXE file from a GW-BASIC or BASICA program, it
	must first be saved in ASCII (text) format in the GWBASIC.EXE or
	BASICA.EXE editor. The following GW-BASIC or BASICA statement will
	save TEST.BAS in ASCII format:
	
	   SAVE "TEST",A
	
	Binary format is the default SAVE format in BASICA and GW-BASIC; thus,
	you must explicitly save with the A (ASCII) option before BC.EXE can
	handle the source file.
	
	BASICA is an interpreter shipped in the ROM of some IBM and COMPAQ
	computers. Microsoft GW-BASIC Interpreter is shipped with some
	versions of DOS, depending upon the hardware vendor or the version of
	MS-DOS.
	
	Additional reference words: B_QuickBas B_GWBasicI
