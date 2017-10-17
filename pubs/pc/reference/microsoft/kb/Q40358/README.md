---
layout: page
title: "Q40358: Bit-Shift Function in C"
permalink: /pubs/pc/reference/microsoft/kb/Q40358/
---

## Q40358: Bit-Shift Function in C

	Article: Q40358
	Version(s): 5.10    | 5.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	Question:
	
	How do I rotate, rather than shift, bits in a word? I don't want to
	lose any bits as happens when I shift.
	
	Response:
	
	Use the _rotl and _rotr functions in the C Runtime Library. These
	are described in the "Microsoft C Run-Time Library Reference."
