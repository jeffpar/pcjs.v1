---
layout: page
title: "Q58488: Change in Hex Literal Interpretation with C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q58488/
---

	Article: Q58488
	Product: Microsoft C
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 18-APR-1990
	
	ANSI mandates that the \0x... character constant doesn't end until the
	first nonhexadecimal character, regardless of how many characters that
	might be.
	
	Microsoft C Version 5.10 ends the constant at the third character or
	just before the first nonhexadecimal character, regardless of whether
	or not characters after the third were valid hexadecimal characters.
	
	Therefore, while "abc\x34564gh" is represented in Version 5.10 as
	shown below
	
	   Character       a   b   c   E   6   4   g   h
	   Hex            61  62  63  45  36  34  67  68
	   Decimal        97  98  99  69  54  52 103 104
	
	note that the character after "c" is "\x345". Since this has to fit in
	one byte, and since the rules of C say that the low bits are preserved
	when converting to a shorter type, "\x345" is equivalent to "\x45".
	
	In Microsoft C Version 6.00, the string is represented as follows:
	
	   Character       a   b   c   d   g   h
	   Hex            61  62  63  64  67  68
	   Decimal        97  98  99 100 103 104
	
	Note that "\x34564" -- the character after the "c" -- is equivalent to
	"\x64" for the same reason as "\x345" was equivalent to "\x45" under
	the old rules above. The reason that the hexadecimal constant includes
	all the characters up to but not including the nonhexadecimal
	character "g" is the rule change described above. C 6.00 will issue a
	warning if the character is too large to fit in a byte -- C 5.10
	compiles such code without warnings.
	
	The best workaround for this change is to end the string immediately
	after the hex character and restart it. For instance, the string
	"abc\x34""564gh" is interpreted by both C 5.10 and C 6.00 as
	containing the following:
	
	   Character       a   b   c   4   5   6   4   g   h
	   Hex            61  62  63  34  35  36  34  67  68
	   Decimal        97  98  99  52  53  54  52 103 104
	
	Such a string works properly when compiled using any ANSI compatible
	compiler.
