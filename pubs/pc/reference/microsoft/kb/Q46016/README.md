---
layout: page
title: "Q46016: C2018: Unknown Characters During Compile"
permalink: /pubs/pc/reference/microsoft/kb/Q46016/
---

## Q46016: C2018: Unknown Characters During Compile

	Article: Q46016
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-OCT-1989
	
	Problem:
	
	When I copied an example from the QuickC Advisor (on-line help) and
	tried to compile it, I received errors with one of the following
	messages:
	
	   volume.c(2) : error C2018 : unknown character '0xc4'
	or
	   volume.c(1) : error C2018 : unknown character '0x11'
	
	Response:
	
	It is possible to actually copy the Advisor header along with the
	sample program. The example screens have a list of help buttons, e.g.
	<Contents> or <Index>, separated from the sample program by a line
	consisting of the ASCII extended character '0xc4'. If you mistakenly
	copy either of these two lines from the help screen, the compiler
	shows the error C2018.
	
	To prevent this problem, delete the Advisor header lines from your
	source file.
