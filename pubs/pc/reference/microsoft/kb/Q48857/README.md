---
layout: page
title: "Q48857: Video Modes Available on Tandy 1000 Computers"
permalink: /pubs/pc/reference/microsoft/kb/Q48857/
---

	Article: Q48857
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 10-OCT-1989
	
	Question:
	
	Using Quick C and a Tandy 1000TX computer, what video modes are
	available?
	
	Response:
	
	There is an on-line example that tests every video mode on your
	computer until a video mode cannot be set. The program starts by going
	through all the text modes, and then it tests the graphics modes. This
	sample program can be found under _setvideomode() on-line help.
	
	The following is a list of video modes that work on Tandy 1000
	computers:
	
	   _TEXTBW40
	   _TEXTC40
	   _TEXTBW80
	   _TEXTC80
	   _MRES4COLOR
	   _MRESNOCOLOR
	   _HRESBW
