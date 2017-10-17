---
layout: page
title: "Q26485: Trapping ALT+, SHIFT+, or CTRL+PRINT SCREEN, &amp;H80 Key Flag"
permalink: /pubs/pc/reference/microsoft/kb/Q26485/
---

## Q26485: Trapping ALT+, SHIFT+, or CTRL+PRINT SCREEN, &amp;H80 Key Flag

	Article: Q26485
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_GWBasicI
	Last Modified: 23-MAY-1989
	
	Problem:
	
	I am unable to trap the PRINT SCREEN key (on an IBM extended
	keyboard, such as on an IBM AT) when pressed simultaneously with the
	ALT, SHIFT, or CTRL key. However, these can be trapped, with the
	exception of CTRL+PRINT SCREEN, within the QuickBASIC editing
	environment.
	
	These keys can be trapped using GW-BASIC Interpreter Version 3.20. The
	following is a code example:
	
	KEY 15, CHR$(&H04) + CHR$(&H37)
	KEY(15) ON
	ON KEY(15) GOSUB keytrap
	idle: GOTO idle
	keytrap:
	   PRINT "CONTROL+PRINT SCREEN key sequence trapped"
	   RETURN
	
	Response:
	
	This problem results because the value &H80 is missing from the
	keyboardflag argument of the KEY statement. You must add this value
	whenever you trap the PRINT SCREEN key on an extended keyboard.
	Therefore, the correct method for trapping the key is as follows:
	
	KEY 15, CHR$(&H80 + &H04) + CHR$(&H37)
	KEY(15) ON
	ON KEY(15) GOSUB keytrapidle: GOTO idle
	keytrap:
	   PRINT "CONTROL+PRINT SCREEN key sequence trapped"
	   RETURN
