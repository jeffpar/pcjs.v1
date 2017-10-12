---
layout: page
title: "Q66231: How to Insert Spaces Before a Block of Text in PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q66231/
---

	Article: Q66231
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_EDITOR
	Last Modified: 24-OCT-1990
	
	It is sometimes desirable to indent or move over a block of text in
	the Programmer's WorkBench (PWB) or the M Editor. The following steps
	can be used to insert spaces before a block of text to indent it:
	
	1. Get into boxarg mode. You can select this mode from the Edit menu
	   under the Programmer's Workbench, or select the boxstream function
	   under the Microsoft Editor.
	
	2. Highlight the area you want to contain the spaces. This may be
	   anywhere in the file.
	
	3. Select the linsert function. By default, this is CTRL+N.
	
	The highlighted area should now be moved over and replaced by spaces.
	
	You don't have to be in boxarg mode for this to work; linsert always
	treats its argument as a boxarg regardless of the current mode.
	However, the highlight on the screen won't match the area that is
	going to be inserted unless you use boxarg mode.
	
	Also, ldelete can be used to unindent a block of text. However, you
	must be in boxarg or streamarg mode for it to work correctly. In
	linearg mode, it will delete entire lines.
