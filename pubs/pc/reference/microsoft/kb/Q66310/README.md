---
layout: page
title: "Q66310: C4093 Can Be Caused by MASM-Style Comments in _asm Code"
permalink: /pubs/pc/reference/microsoft/kb/Q66310/
---

## Q66310: C4093 Can Be Caused by MASM-Style Comments in _asm Code

	Article: Q66310
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	The C4093 (Unescaped NewLine in Character Constant in Inactive Code)
	warning message will be generated if a section of code is removed with
	the preprocessor (#if, #ifdef, etc.) and a constant spans two lines or
	is not completed. The following is an example:
	
	void main(void)
	{
	#ifdef foo
	   printf("This is an error\n );
	#endif
	}
	
	However, the C4093 error can also occur in a MASM-style comment to an
	inline assembler instruction. For instance:
	
	void main(void)
	{
	#ifdef foo
	   _asm mov ax, 10  ; "Set return code
	#endif
	}
	
	In this case, if the code hadn't been inactive, the line would not
	have been flagged.
	
	Workarounds
	-----------
	
	There following are two workarounds:
	
	1. Do not use MASM-style comments. If C-style comments (// or /* */)
	   are used instead, the error is not generated.
	
	2. Add the closing quotation mark to the line.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
