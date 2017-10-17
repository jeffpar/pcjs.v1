---
layout: page
title: "Q57884: Listbox Initialized Incorrectly in BASIC 7.00 UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q57884/
---

## Q57884: Listbox Initialized Incorrectly in BASIC 7.00 UI Toolbox

	Article: Q57884
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900109-123 buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	The ListBox FUNCTION in the User Interface (UI) Toolbox WINDOW.BAS
	file provided with Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 does not behave correctly when a list box
	is first activated. On initialization, the keyboard cursor is set on
	the OK button instead of in the list box.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS. We are researching this problem and
	will post new information here as it becomes available.
	
	Without the modification listed below, you must press the TAB key
	twice before using the cursor keys to move into the list box.
	
	To correct this behavior, the initial value of currButton (set early
	in the ListBox FUNCTION) must be changed from 2 to 0. The following
	are the statements from the ListBox FUNCTION of WINDOW.BAS adjacent to
	(and including) the incorrect statement:
	
	   currTop = 1
	   currPos = 1
	   currButton = 2       '****** Need to change this to currButton = 0
	
	   GOSUB ListBoxDrawText
	
	This correction should be made and the libraries rebuilt to have the
	cursor positioned properly in the list box.
	
	To find other problems with the User Interface Toolbox, query in this
	Knowledge Base on the following words:
	
	   User and Interface and Toolbox and buglist7.00
