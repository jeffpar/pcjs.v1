---
layout: page
title: "Q32779: Illegal Instruction under CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q32779/
---

## Q32779: Illegal Instruction under CodeView

	Article: Q32779
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 19-JUL-1988
	
	When the following program is assembled with the /Zi switch,
	linked with the /CO switch, and traced under CodeView, an illegal
	instruction occurs:
	
	_text segment
	assume cs:_text
	       db 08h,0c1h
	_text ends
	end
	
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
