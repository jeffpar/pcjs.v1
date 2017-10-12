---
layout: page
title: "Q49378: Label Finding Command Does Whole Word Search, Not Text Search"
permalink: /pubs/pc/reference/microsoft/kb/Q49378/
---

	Article: Q49378
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 27-OCT-1989
	
	In CodeView Versions 2.20 and 2.30, under the Search menu is the Label
	option for searching for a label. Unlike the Find option, which
	searches the source code for any regular expression, the Label option
	searches the executable code for an assembly language label.
	
	This search is not a text search and does not accept regular
	expressions. The only way to find a label is to specify the entire
	label name as the search string. In addition, if the Case Sense option
	is selected on the Options menu, the label is found only if the case
	of each character matches exactly.
	
	For example, if you want to find the code for the standard C
	stack-checking function "_chkstk", choose Search Label, and type in
	"__chkstk" (without the quotation marks), and press ENTER. This
	switches you into assembly mode, if you weren't there already, and
	puts the line with the __chkstk label at the top of the window. The
	two underscores are required since C appends an underscore to the
	front of all labels and the original function name is "_chkstk".
	
	You will receive the error message "Unknown Symbol" if the label
	cannot be found or if you mistype or incompletely type the correct
	name. For example, "_chkstk", "chkstk", "__chk", and "__chkstks" all
	fail to find a match in the above example. If Case Sense is on,
	searching for the label "__CHKSTK" also results in failure.
