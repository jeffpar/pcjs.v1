---
layout: page
title: "Q66631: How to Add a Category in QuickHelp"
permalink: /pubs/pc/reference/microsoft/kb/Q66631/
---

	Article: Q66631
	Product: Microsoft C
	Version(s): 1.70   | 1.40 1.70
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_qh s_helpmake
	Last Modified: 24-JAN-1991
	
	When creating a help database with HELPMAKE, new categories may be
	added to the Microsoft Advisor help system for use in the QuickHelp
	utility. To add selections that will appear under the QuickHelp
	Categories menu, use the topic "List categories." Under the List
	categories topic, list the selections that need to be added to the
	menu.
	
	The following is a sample help file:
	
	   File CATEGORY.TXT
	   -----------------
	
	      .context List categories
	      Category1
	      Category2
	
	      .context Category1
	      This is the information under the first category.
	
	      .context Category2
	      This is the information under the second category.
	
	For the file CATEGORY.TXT shown above, the HELPMAKE command line will
	appear as follows:
	
	   helpmake /E8 /Ocategory.hlp category.txt
	
	The choice of /E8 for partial compression is strictly arbitrary in
	this case, and is shown for demonstration purposes only. The maximum
	compression can be achieved by using /E15, and no compression is
	denoted by /E0.
	
	When the above help database is added to the list of databases for the
	Advisor, the topics "Category1" and "Category2" will be added under
	the Categories menu.
	
	The items that are placed in the List categories topic should be
	topics that are already defined with ".context" strings; otherwise,
	when the item is selected from the Categories menu, a message will be
	displayed stating that the topic could not be found.
	
	When using HELPMAKE with the "/C" option, which preserves case
	sensitivity, you must use the string "List categories" exactly. The
	case is important. Failure to use the exact case for each letter will
	cause the Advisor to ignore the categories you have added.
