---
layout: page
title: "Q43064: NMAKE and the Backslash &quot;&#92;&quot; Character"
permalink: /pubs/pc/reference/microsoft/kb/Q43064/
---

	Article: Q43064
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 3-MAY-1989
	
	The backslash "\" character in NMAKE has two different meanings
	depending on how it is used. One of its uses is as a line-continuation
	character. The other use is as a path specifier.
	
	The primary use of "\" is as a line continuation-character. For
	example, if you have a dependency line that extends more than one
	line, use the "\" character to continue to the next line. It is
	correct to include a space prior to the "\" or to append it to the
	last dependent, as in the following examples:
	
	FOO : obj1 obj2 obj3 obj4 obj5 \  (CORRECT)
	obj6 obj7...etc.
	
	FOO : obj1 obj2 obj3 obj4 obj5\   (CORRECT)
	obj6 obj7...etc.
	
	The "\" character is also used as a path specifier. When "\" is the
	last character on the line and is meant as a path specifier, you must
	precede it with the caret "^" character to tell NMAKE to override its
	meaning as a line-continuation character.
	
	The following macro definition is an example demonstrating the use of
	"\" as a path specifier:
	
	exe_dir = c:\bin^\    (CORRECT)
	
	exe_dir = c:\bin\     (INCORRECT)
	
	The following will be interpreted as a line-continuation character.
	
	exe_dir = c:\bin\     (INCORRECT)
	
	Preceding the "\" with another "\" will nullify the meaning as a
	line-continuation character. However, when this macro is expanded,
	both backslashes will appear, producing an incorrect path.
