---
layout: page
title: "Q59724: List Box Width Can Be Only 14-55 Characters in 7.00 UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q59724/
---

## Q59724: List Box Width Can Be Only 14-55 Characters in 7.00 UI Toolbox

	Article: Q59724
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900222-126
	Last Modified: 26-MAR-1990
	
	The ListBox() function of the WINDOW.BAS toolbox file takes two
	parameters: a string array containing the list of items to be
	displayed, and an integer variable containing the number of items in
	the list.
	
	The header comment of the ListBox() function describes how to add a
	third parameter, an integer variable (BoxWidth%) that contains the
	desired width of the list box to be displayed. Unless this parameter
	is added, the width of the list box always defaults to 14 characters.
	However, even if this parameter is given, the width cannot be less
	than 14 or greater than 55 characters. The ListBox() function ensures
	that the width is within this range.
	
	This information applies to the User Interface (UI) Toolbox in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS.
	
	After adding the modification that allows the desired list box width
	to be specified, a sample invocation of the ListBox() function would
	be as follows
	
	   x% = ListBox(text$(),MaxRec%,BoxWidth%)
	
	where:
	
	   x%         is the array element selected from the list box
	   text$()    is the string(s) to display in the list box
	   MaxRec%    is the number of strings to display in the list box
	   BoxWidth%  is the desired width of the list box
	
	If BoxWidth% is less than 14, ListBox() changes it to 14. If BoxWidth%
	is greater than 55, ListBox() changes it to 55. The statements that
	perform these checks are located toward the end of the function under
	the subroutine heading ListBoxWidthCalc:
	
	   IF BoxWidth < 14 THEN BoxWidth = 14
	   IF BoxWidth > 55 THEN BoxWidth = 55
	
	It is NOT recommended that you change or delete these IF statements to
	allow any list box width. If the width is too small, the OK and Cancel
	buttons may not fit in the list box. If the width is too large, the
	resulting list box may not fit on the screen.
