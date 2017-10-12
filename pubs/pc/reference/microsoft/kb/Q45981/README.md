---
layout: page
title: "Q45981: How to Search Multiple Files in QuickC Advisor"
permalink: /pubs/pc/reference/microsoft/kb/Q45981/
---

	Article: Q45981
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 27-JUN-1989
	
	You can search through the QuickC Advisor (on-line help) for a
	specific string, even when it is not listed in the "Help.Contents"
	screen.
	
	The following example demonstrates how to search on the string "DOS"
	to find information on DOS access routines:
	
	1. Load QuickC Version 2.00. Select "Options.Display."
	
	2. In the right column of the dialog box you, find "Search Multiple
	   Help Topics". Set this option and press ENTER.
	
	3. Select "Help.Contents". (Notice that there is no item for DOS
	   access routines.) Select "Search.Find" and enter the string "DOS"
	   in the dialog box at the "Find What:" prompt.
	
	4. The QuickC Advisor searches the "Help.Contents" screen for a
	   matching item. In this example, there is no matching item, so a
	   dialog box pops up and says "Search string not found Continue
	   searching topics?" Answer "Yes."
	
	5. When it finds a match, the Advisor stops searching and displays a
	   blinking cursor and highlight on the requested string. In this
	   example, the string "DOS" is highlighted in the line "System Calls
	   - DOS". Press F1 or ENTER to see a screen listing all the DOS
	   System calls. (Press F3 to see the next match.)
	
	6. Pick a function to examine, for example, "_dos_getdrive". Place the
	   cursor on it and press F1. You should see the "Help.Index.Summary"
	   screen for the function.
	
	Once you see the Summary, you can choose Details for additional
	information or select Example for a complete, running example program
	that you can "Edit.Copy" and "Edit.Paste" into your QuickC edit
	screen. "Edit.Copy" and "Edit.Paste" are demonstrated in the QuickC
	Tutorial (LEARN.EXE) in the "Getting Around in QuickC, Managing
	Windows," in the Notepad Window example.
	
	You can also use "Search.Find" when the "Help.Index" menu is on the
	screen.
