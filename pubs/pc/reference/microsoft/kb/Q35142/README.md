---
layout: page
title: "Q35142: Weitek WTL 1167 Math Coprocessor Support"
permalink: /pubs/pc/reference/microsoft/kb/Q35142/
---

	Article: Q35142
	Product: Microsoft C
	Version(s): 5.x    | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The Weitek WTL 1167 is found on Compaq's Weitek Coprocessor Board. The
	WTL 1167 is a set of three chips used as a replacement for the Intel
	80387. Benchmarks in the 1988 March BYTE, show the WTL 1167 with a 7
	percent to 68 percent speed increase over the 80387 on processing of
	double-precision numbers. ("Real-World" speed increase is more like 30
	percent.) Compaq's Weitek Coprocessor Board was designed with an 80387
	socket.
	
	Microsoft only has Math Coprocessor support for Intel chips. If you
	have the WTL 1167 on a Compaq Weitek Coprocessor Board, you also must
	have an 80387 to use our Math Coprocessor Library. Without the 80387
	you will have to use our Emulator or Alternate Math Libraries, or link
	with a third-party library.
