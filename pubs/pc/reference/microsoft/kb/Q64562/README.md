---
layout: page
title: "Q64562: View.Source Truncates Long Pathnames"
permalink: /pubs/pc/reference/microsoft/kb/Q64562/
---

## Q64562: View.Source Truncates Long Pathnames

	Article: Q64562
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.50 buglist2.51
	Last Modified: 31-AUG-1990
	
	The pathname of source files may be truncated when the View menu is
	selected and Source is chosen in QuickC versions 2.50 and 2.51.
	
	This truncation usually results in the wrong file being opened, or
	QuickC will ask if you want to create a new file with the truncated
	name.
	
	To reproduce this problem, do the following:
	
	1. Set a program list (select Set Program List from the Make menu).
	
	2. Add a file with a very long pathname (greater than 36 characters)
	   to the program list.
	
	3. Now choose Source from the View menu and select the file with the
	   long pathname. The pathname will be truncated and an incorrect file
	   will be opened.
	
	Although QuickC should be able to accept longer pathnames, the limit
	of the drive/pathname is 36 characters for the View.Source menu item.
	This length limit is not apparent in any other QuickC menu items or
	functions.
	
	A workaround for this problem is to make the pathname shorter.
	
	Microsoft has confirmed this to be a problem in QuickC versions 2.50
	and 2.51. We are researching this problem and will post new
	information here as it becomes available.
