---
layout: page
title: "Q24201: Flipping and Swapping Screens"
permalink: /pubs/pc/reference/microsoft/kb/Q24201/
---

	Article: Q24201
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-AUG-1989
	
	Question:
	   What is the difference between flipping and swapping in CodeView?
	
	Response:
	   Both are ways of maintaining two alternate screens for display on
	one monitor. The difference is in the way the task is accomplished.
	   When swapping is selected, CodeView allocates a 16K buffer (a 4K
	buffer for a monochrome adapter) to hold the alternate screen. When
	the other screen is required, CodeView swaps the screen into the
	display buffer and places the other screen into the storage buffer.
	Swapping takes memory and time, but it does not have the limitations
	of flipping.
	   Flipping uses the video-display pages of the graphics adapter to
	store each screen of text. When the alternate screen is required, the
	other page is selected. Flipping is much faster than swapping and does
	not require the 16K buffer. However, it cannot be used with a
	monochrome adapter, or with programs that display graphics or use the
	video pages.
