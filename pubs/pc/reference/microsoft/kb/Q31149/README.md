---
layout: page
title: "Q31149: Mouse-Cursor State and EGA Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q31149/
---

	Article: Q31149
	Product: Microsoft C
	Version(s): 6.x
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-JUN-1988
	
	The Microsoft Mouse driver EGA interface maintains the mouse-cursor
	state in the unused 8K of video memory available at the top of the
	four 64K buffers that comprise the 256K of total video memory
	available on a loaded EGA adapter. Normally this is of little
	consequence in programming such systems; however, if you resize the
	video buffer by reprogramming the CRT Controller's Offset register,
	problems may occur.
	   You will know there is a problem if garbage appears on the display
	after panning through an enlarged virtual screen.
	   To work around this problem, do not use Mouse Function 1 to show
	the mouse cursor. Instead, use an alternative method of monitoring the
	mouse's screen location (e.g. XOR some graphical object to the
	screen).
