---
layout: page
title: "Q50339: Not All Extended ASCII Characters Are Mapped by QuickC Fonts"
permalink: /pubs/pc/reference/microsoft/kb/Q50339/
---

## Q50339: Not All Extended ASCII Characters Are Mapped by QuickC Fonts

	Article: Q50339
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 17-JUL-1990
	
	Problem:
	
	When I display the extended ASCII character set with a QuickC font,
	the characters do not match my chart for the characters. However, when
	I watch an array of the extended characters in the watch window, they
	are the same as my chart.
	
	Response:
	
	There are three parts to this response:
	
	1. What happens in the watch window, versions 2.00 and 2.01
	
	2. The fonts and Presentation Graphics (PG) default font in QuickC
	   version 2.00
	
	3. The fonts and PG default font in QuickC Version 2.01
	
	What Happens in the Quick Environment
	Watch Window, Versions 2.00 and 2.01
	-------------------------------------
	
	The Quick environment's watch window uses the system character set,
	not fonts. The default system character set in the United States is
	codepage 437, a table of 256 character correspondence codes. Codepage
	437 matches the IBM extended character set so the watch window
	displays the standard characters.
	
	It is possible to override the default system character set with DOS's
	command to change codepage (CHCP). However, a call to _setvideomode()
	-- required when you use fonts -- will reset the system character set
	to the default.
	
	The Fonts and PG Chart Default Font in QuickC Version 2.00
	----------------------------------------------------------
	
	The .FON files contain the ANSI character set, not the extended ASCII
	character set. They match the ASCII character set only from hex 20
	through hex 7E. When you use _outgtext() to display any of the
	extended characters, only characters from hex 20 through hex 7E will
	match your ASCII chart; for example, the function _outgtext() displays
	the ANSI characters. The function _outtext() displays the ASCII
	characters.
	
	The PG Chart default font uses a bitmap that is the same as codepage
	437. Extended characters you display with the default font will match
	the extended ASCII chart.
	
	The Fonts and PG Chart Default Font in QuickC Version 2.01
	----------------------------------------------------------
	
	The .FON files are the same as Version 2.00 .FON files. However, in
	QuickC Version 2.01, the _outgtext() function maps the ANSI character
	set onto codepage 850. Codepage 850 is a multilingual character set
	(as distinct from codepage 437, which is the U.S. character set).
	
	While not an exact match of the extended ASCII character set, codepage
	850 matches more ASCII chart characters than the ANSI character set
	does. Specifically, codepage 850 and the ASCII chart share the
	accented vowels used in European languages. When you use _outgtext()
	to display extended characters using fonts in Version 2.01, more of
	the characters will match the ASCII chart than when you use Version
	2.00. (The function _outtext() displays the ASCII characters in
	Version 2.01 as it does in Version 2.00.)
	
	In Version 2.01 the PG Chart default font maps to codepage 850
	(instead of codepage 437).
	
	The QuickC .FON files are identical to the .FON files used in the
	Microsoft Windows operating environment. You can use any fonts files
	that are compatible with Windows with QuickC. You can find more
	information on fonts in "C for Yourself," Chapter 14, "Fonts."
	
	For more information on the ANSI characters, refer to Page 152 in
	"Programming Windows," Chapter 4, "The Keyboard."
	
	You can find additional information on codepages in "The MS-DOS
	Encyclopedia."
