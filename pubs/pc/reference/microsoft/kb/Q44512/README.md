---
layout: page
title: "Q44512: Stack Considerations When Calling Procedures in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q44512/
---

## Q44512: Stack Considerations When Calling Procedures in MASM

	Article: Q44512
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	When calling procedures in Microsoft Macro Assembler, you must watch
	the stack manipulations within the called procedure.
	
	If several items are PUSHed onto the stack, they must be POPped off in
	the same number. This is necessary because when the RET is encountered
	at the end of the procedure, it expects the return address to be on
	the top of the stack.
	
	This problem can be avoided by temporarily storing the return address
	in a location other than the stack and then PUSHing it back on before
	the RET. However, because the results may not be consistent, this
	workaround is not recommended.
