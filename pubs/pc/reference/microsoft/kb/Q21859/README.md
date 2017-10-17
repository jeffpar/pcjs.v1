---
layout: page
title: "Q21859: WIDTH 40, WIDTH 80; &quot;Illegal Function Call&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q21859/
---

## Q21859: WIDTH 40, WIDTH 80; &quot;Illegal Function Call&quot;

	Article: Q21859
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-DEC-1988
	
	Question:
	
	Why do I get an "Illegal Function Call" using a WIDTH statement with a
	width other than 40 or 80?
	
	Response:
	
	The WIDTH statement operates the same way in QuickBASIC as it does in
	the GW-BASIC Version 3.20 and IBM BASICA interpreters.
	
	To change the allowed width of screen output, you need to open the
	"SCRN:" device and output as follows:
	
	  width "scrn:",11    ' Sets screen width to 11 characters.
	  open "scrn:" for output as #1
	  print#1, "123456789012345678901234567890"
	  close
