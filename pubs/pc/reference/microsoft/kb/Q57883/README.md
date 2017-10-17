---
layout: page
title: "Q57883: UI Toolbox Menu Bar with Menu Past 64th Column Shows Garbage"
permalink: /pubs/pc/reference/microsoft/kb/Q57883/
---

## Q57883: UI Toolbox Menu Bar with Menu Past 64th Column Shows Garbage

	Article: Q57883
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900112-171 buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	The User Interface (UI) Toolbox shipped with Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10
	incorrectly processes menu bars when the last menu item starts in the
	64th or higher column. The symptom of this errant behavior is that
	garbage characters are displayed on the screen after that menu is
	deselected.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS. We are researching this problem and
	will post new information here as it becomes available. A correction
	for this problem in MENU.BAS is shown below.
	
	To correct the source code, MENU.BAS, so that it will handle longer
	menu bars correctly, change the following IF statement (found after
	the "menuDoShowPullDown" label near the end of the MenuDo SUB)
	
	   LEN(GloTitle(currMenu).text)
	
	to
	
	   LEN(RTRIM$(GloTitle(currMenu).text))
	
	in both of the following places:
	
	  IF GloTitle(currMenu).rColItem - GloTitle(currMenu).lColItem _
	       < LEN(GloTitle(currMenu).text) THEN
	    GloTitle(currMenu).rColItem = _
	       GloTitle(currMenu).lColItem + LEN(GloTitle(currMenu).text)
	  END IF
	
	Note: The underscore (_) characters above indicate line continuation
	to fit in this article. This block IF is actually on three long lines
	in the original source.
	
	The changed code is as follows:
	
	  IF GloTitle(currMenu).rColItem - GloTitle(currMenu).lColItem _
	       < LEN(RTRIM$(GloTitle(currMenu).text)) THEN
	    GloTitle(currMenu).rColItem = _
	       GloTitle(currMenu).lColItem + LEN(RTRIM$(GloTitle(currMenu).text))
	  END IF
	
	This correction should be made and the libraries rebuilt to enable
	correct handling of menus beginning past the 64th column.
	
	The above correction is the same as for a separate article describing
	a different symptom, where the mouse-selectable area for narrow menus
	is too wide. To find this and other problems with the User Interface
	Toolbox, query in this Knowledge Base on the following keywords:
	
	   user and interface and toolbox and buglist7.00
