---
layout: page
title: "Q46183: Search/Change &quot;Match Not Found&quot; If Previous Search/Label"
permalink: /pubs/pc/reference/microsoft/kb/Q46183/
---

## Q46183: Search/Change &quot;Match Not Found&quot; If Previous Search/Label

	Article: Q46183
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom SR# S890616-7
	Last Modified: 26-FEB-1990
	
	In the QuickBASIC Version 4.50 environment, if you attempt to perform
	a Search/Change after previously performing a Search/Label, then a
	"Match Not Found" message or similar message may display. If the
	Search/Change is performed first, it functions correctly.
	
	Microsoft has confirmed this to be a problem in the QB.EXE editor in
	Microsoft QuickBASIC Version 4.50. This problem was corrected in the
	QuickBASIC Extended (QBX.EXE) environment of Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	When using the Label command on the Search menu, the Change command
	doesn't function correctly until another option is chosen from that
	menu. The Change command appears to work in all situations except
	after the Label command has been invoked.
	
	This problem is associated only with the QuickBASIC Version 4.50
	environment and does not occur in earlier versions.
	
	To reproduce the problem, do the following:
	
	1. Enter the following lines of code:
	
	      LPRINT "Hello"
	      LPRINT "GoodBye"
	      label1:
	      LPRINT "The end"
	
	2. Choose Label from the Search menu and find the label "label1".
	
	3. Choose Change from the Search menu and find LPRINT and change it
	   to PRINT. The message "No Match Found" is displayed.
