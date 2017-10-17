---
layout: page
title: "Q36397: Must Use A&#36;=INKEY&#36; after SLEEP to Clear Keyboard Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q36397/
---

## Q36397: Must Use A&#36;=INKEY&#36; after SLEEP to Clear Keyboard Buffer

	Article: Q36397
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-DEC-1989
	
	The SLEEP statement was introduced in QuickBASIC Version 4.00b and
	in Microsoft BASIC Compiler Version 6.00 for MS-DOS and MS OS/2.
	SLEEP does not clear the buffer when a key is pressed. Therefore, the
	next input statement will read the pressed keys to clear prior SLEEP
	commands.
	
	This information applies to Microsoft QuickBASIC Versions 4.00b and
	4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	The following code example demonstrates the problem with a workaround:
	
	CLS
	FOR i = 1 TO 5
	  PRINT "press a key please"
	  SLEEP
	' If you want to clear the buffer, insert the following statement:
	'   x$ = INKEY$
	NEXT
	CLS
	'  If you do not clear the buffer, this INPUT prompts with a print
	'  of the 5 characters pressed in the FOR loop above, and the value of
	'  a$ will be those 5 characters plus any entered at the prompt.
	INPUT a$
	PRINT a$
