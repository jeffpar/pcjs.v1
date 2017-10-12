---
layout: page
title: "Q40593: Misspelling &quot;Default&quot; Gives No Error"
permalink: /pubs/pc/reference/microsoft/kb/Q40593/
---

	Article: Q40593
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	It has been reported that when the keyword "default" is misspelled as
	"defualt", the C compiler does not generate an error and the
	executable code does not execute the "defualt" branch in any case.
	
	This is not a problem with the C compiler. When the keyword "default"
	is spelled incorrectly, it is treated as a label. You may use a goto
	statement to reference the label.
	
	Note: It is not a good programming practice to jump to a label that is
	within a switch statement from outside the switch statement.
