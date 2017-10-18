---
layout: page
title: "Q33067: Automatic Labels for Jump Instructions"
permalink: /pubs/pc/reference/microsoft/kb/Q33067/
---

## Q33067: Automatic Labels for Jump Instructions

	Article: Q33067
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | jmp
	Last Modified: 22-JUL-1988
	
	The Macro Assembler provides a way to generate automatic labels
	for jump instructions.
	   To define the local label to be jumped to, use two at signs (@@)
	followed by a colon (:). The jump instruction's operand field can
	either use @B (back) or @F (forward). The @B will jump to the nearest
	preceding local label and the @F will jump to the nearest following
	label.
	   The example below illustrates this feature:
	
	    cmp ax,cx
	    jge @F
	    .
	    .
	    .
	@@:
	    .
	    .
	    .
	    jle @B
	
	   The jump instruction @F will jump to @@: and the jump instruction @B
	will jump back to @@.
	   Section 3.3 of the "Microsoft Macro Assembler 5.1 Updates and
	Microsoft Editor" manual discusses this new feature.
