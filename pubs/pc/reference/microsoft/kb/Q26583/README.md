---
layout: page
title: "Q26583: @DataSize Misspelled"
permalink: /pubs/pc/reference/microsoft/kb/Q26583/
---

## Q26583: @DataSize Misspelled

	Article: Q26583
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 3-MAR-1989
	
	Problem:
	
	Page 91 of the "MS-DOS Macro Assembler User's Guide" shows @DataSize
	and @CodeSize typed as @datasize and @codesize. This information is
	inconsistent with Mixed.inc, which types them as @Datasize and
	@CodeSize. This process will result in an error when interfacing C and
	MASM using the NOIGNORECASE option.
	
	Response:
	
	Both the documentation and Mixed.Inc should show @DataSize and
	@CodeSize. The mistyping only will matter when assembling with the -Ml
	option to preserve case in names.
