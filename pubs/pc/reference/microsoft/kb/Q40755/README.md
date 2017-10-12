---
layout: page
title: "Q40755: Useful Macros for the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q40755/
---

	Article: Q40755
	Product: Microsoft C
	Version(s): 1.00    |  1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Below are macros for the Microsoft Editor that allow you to save a
	marked portion of a file and insert it into another file. Also, there
	are macros that speed up marking large areas of text.
	
	To save a marked area of a file, mark the area and invoke this macro
	by typing ALT+V. Note that although the macro is broken onto two lines
	here, you should put it on one line in your TOOLS.INI file.
	
	savemark:=copy arg "command /c del c:\\t" shell arg "\\t" setfile
	          refresh paste setfile
	savemark:alt+v
	
	A one-key way to include the file in another file is to use the macro
	by typing ALT+I:
	
	insertmark:=arg arg "\\t" paste
	insertmark:alt+i
	
	To mark the top and bottom of the text area, use these macros. Type
	ALT+T to place the marker, then ALT+U to use it. Type CTRL+INS or
	CTRL+Y to copy or delete the text. Note that if your cursor is not in
	the same column when you type ALT+U as when you typed ALT+T, the area
	marked will be a box rather than a set of lines. Note also that the
	marked area will NOT show up on the screen.
	
	tempmark:=arg arg "temp" mark
	usemark:=arg "temp"
	tempmark:alt+t
	usemark:alt+u
