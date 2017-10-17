---
layout: page
title: "Q37306: &quot;Device I/O Error&quot; If Keyboard Buffer Filled During &quot;COM1&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q37306/
---

## Q37306: &quot;Device I/O Error&quot; If Keyboard Buffer Filled During &quot;COM1&quot;

	Article: Q37306
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	When the keyboard buffer becomes full while serial communications are
	executing, a "Device I/O error" (error 57) may occur.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b), and in
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS and MS OS/2 (buglist7.00). This problem was corrected in BASIC
	PDS version 7.10 (fixlist7.10).
	
	To work around this problem, use the INKEY$ function to poll the
	keyboard so that any keyboard input will be flushed. This process is
	shown below.
	
	When the program code example below is run without any keyboard
	interference, the program runs to completion. However, if you type
	enough to fill the keyboard buffer, a "Device I/O error" occurs.
	
	The following is a code example:
	
	   DEFINT A-Z
	   OPEN "COM1:1200,n,8,1,cs0,ds0" FOR RANDOM AS #1
	   ON COM(1) GOSUB emptycom
	   COM(1) ON
	   FOR i = 1 TO 10000
	     '  WHILE INKEY$<>"": WEND   ' Used to Empty the Keyboard buffer
	     PRINT #1, "a"
	   NEXT i
	   CLOSE
	   END
	
	   emptycom:
	     '  WHILE INKEY$<>"": WEND  '  Used to Empty the Keyboard buffer
	     INPUT #1, s$
	     PRINT s$,
	     RETURN
