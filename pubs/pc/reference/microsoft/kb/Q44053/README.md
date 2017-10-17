---
layout: page
title: "Q44053: Regular Expression Replacements in QuickC 2.00 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q44053/
---

## Q44053: Regular Expression Replacements in QuickC 2.00 Editor

	Article: Q44053
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	Question:
	
	Can the regular expression replacement symbols be used in the "Change
	To:" field of the Change... option in the Search menu in QuickC 2.00?
	For example, could I use the regular expression "...." in the "search"
	field and replace it with '....', effectively replacing all strings of
	length four in double quotation marks with the same string in single
	quotation marks.
	
	Response:
	
	Regular expressions are limited to the "Find What:" field of the
	Change... option in the Search menu. In the example above, every
	occurrence of a string of four characters between double quotation
	marks in the text would be replaced with '....'.
	
	For a more complete discussion of regular expressions in QuickC 2.00,
	select the Change... option in the Search menu and press the F1 key
	for help.
