---
layout: page
title: "Q27764: CODEVIEW.DOC File Error: Mouse Works with the /2 Option"
permalink: /pubs/pc/reference/microsoft/kb/Q27764/
---

## Q27764: CODEVIEW.DOC File Error: Mouse Works with the /2 Option

	Article: Q27764
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 8-NOV-1988
	
	Question:
	   The CODEVIEW.DOC file included with Microsoft C Version 5.10 states
	that using the /2 switch disables mouse support on the debugging
	display. Is this true?
	
	Response:
	   This is an error in the CODEVIEW.DOC file.
	   CodeView does support the mouse when using the /2 switch. In fact,
	if you are debugging a program which itself uses the mouse, using the
	/2 switch will allow you to use the mouse on CodeView's debugging
	screen as well as your application's output screen.
