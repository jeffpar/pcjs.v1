---
layout: page
title: "Q66308: PWB's Use of Expanded Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q66308/
---

	Article: Q66308
	Product: Microsoft C
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-OCT-1990
	
	The DOS version of the Programmer's WorkBench (PWB) will utilize
	expanded memory to swap its own segment overlays if it detects that
	expanded memory is available in the system. When PWB needs a new
	overlay, the existing overlay in memory is first copied into expanded
	memory. If there is not enough room in expanded memory to copy the
	overlay, the least recently used overlay is discarded to make room for
	it. This scheme allows most overlays to be read from expanded memory
	instead of from disk.
	
	Note that this is the only method by which PWB will take advantage of
	available expanded memory, and that PWB versions 1.00 and 1.10 have no
	internal provisions to make use of extended memory in any way.
