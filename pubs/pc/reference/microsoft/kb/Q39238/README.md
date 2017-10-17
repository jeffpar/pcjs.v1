---
layout: page
title: "Q39238: &quot;File AB45ADVR.HLP Not Found&quot; QB Advisor 4.50, ERASE Example"
permalink: /pubs/pc/reference/microsoft/kb/Q39238/
---

## Q39238: &quot;File AB45ADVR.HLP Not Found&quot; QB Advisor 4.50, ERASE Example

	Article: Q39238
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr buglist4.50
	Last Modified: 26-FEB-1990
	
	The QB Advisor on-line help in QuickBASIC Version 4.50 fails to find
	the example for the ERASE statement when the <example> hyperlink
	button is chosen for that statement. QB Advisor displays "File
	AB45ADVR.HLP not found" in a dialog box and prompts you to reset the
	environment path or insert the disk with that file.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Version 4.50. The problem does not occur in the QuickBASIC Extended
	(QBX) enviroment which comes with Microsoft BASIC Professional
	Development System (PDS) Version 7.00 (fixlist7.00).
	
	To work around this problem, first select ERASE <detail> information
	and then choose ERASE <example>.
	
	Note: There is no file in QuickBASIC Version 4.50 called AB45ADVR.HLP,
	but there is one called QB45ADVR.HLP. QB45ADVR is misspelled as
	AB45ADVR in the error message.
	
	A test of the other keywords in QB Advisor showed no other words give
	the message "File AB45ADVR.HLP not found".
	
	The following is a more roundabout workaround:
	
	1. After entering the QB Advisor, choose the help INDEX.
	
	2. Choose the EOF Function (two before ERASE on the list).
	
	3. Choose the EOF Function example, then press CTRL+F1 (or select
	   <Next>). This will put you in the window for the ERASE statement.
	
	4. Choose the ERASE <example> and it will come up on the screen.
