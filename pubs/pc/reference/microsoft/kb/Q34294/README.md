---
layout: page
title: "Q34294: Cannot Overlay Small-Model Code"
permalink: /pubs/pc/reference/microsoft/kb/Q34294/
---

## Q34294: Cannot Overlay Small-Model Code

	Article: Q34294
	Version(s): 3.60 3.61 3.64 3.65 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	Problem:
	
	I have specified overlays for my small-model code, but the link map
	shows that no overlays are produced.
	
	Response:
	
	You cannot overlay small-model code. You must change the memory model
	to medium, large, or huge. Page 285 of the "Microsoft CodeView
	Utilities" manual that comes with C Versions 5.00 and 5.10, MASM
	Versions 5.00 and 5.10, and Pascal Version 4.00, and Page 135 of the
	"Microsoft FORTRAN Optimizing Compiler User's Guide" states that you
	can overlay only modules to which control is transferred and returned
	by a standard 8086 long (32-bit) call/return instruction.
