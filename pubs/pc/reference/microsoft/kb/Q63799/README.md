---
layout: page
title: "Q63799: 7.00 UI Toolbox MENU.BAS Correction, Narrow Menu Selectability"
permalink: /pubs/pc/reference/microsoft/kb/Q63799/
---

## Q63799: 7.00 UI Toolbox MENU.BAS Correction, Narrow Menu Selectability

	Article: Q63799
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 buglist7.10
	Last Modified: 2-NOV-1990
	
	The User Interface (UI) Toolbox provided in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10
	incorrectly allows a mouse cursor to choose a menu option from outside
	the confines of a narrow pull-down menu.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS. The correction is provided below.
	
	To correct this problem, the source code of MENU.BAS can be changed to
	correctly choose items in a narrow pull-down menu. Change the
	following IF statement found in the SUB MenuDo near the line label
	"menuDoShowPullDown:". (When you load MENU.BAS into the QBX.EXE
	editor, this label is at line number 650, and the IF statement is
	located at line 660.)
	
	Change the following line
	
	     LEN(GloTitle(currMenu).text)
	to
	     LEN(RTRIM$(GloTitle(currMenu).text))
	
	in both of the following places:
	
	     IF GloTitle(currMenu).rColItem - GloTitle(currMenu).lColItem _
	               < LEN(GloTitle(currMenu).text) THEN
	          GloTitle(currMenu).rColItem = GloTitle(currMenu).lColItem _
	               + LEN(GloTitle(currMenu).text)
	     END IF
	
	Note: The underscore characters (_) above indicate line-continuation
	characters. The block IF statement actually appears as three lines in
	the original source code of MENU.BAS.
	
	The changed code is as follows:
	
	     IF GloTitle(currMenu).rColItem - GloTitle(currMenu).lColItem _
	               < LEN(RTRIM$(GloTitle(currMenu).text)) THEN
	          GloTitle(currMenu).rColItem = GloTitle(currMenu).lColItem _
	               + LEN(RTRIM$(GloTitle(currMenu).text)
	     END IF
	
	To enable correct handling of narrow pull-down menus, this change
	should be made and the libraries rebuilt as follows:
	
	     BC /X/FS MENU.BAS;
	
	     LIB UITB -+MENU;     [Note: UITB.LIB is the library that
	                                 GENERAL.BAS outlines how to build.]
	
	     LINK /Q UITB.LIB,UITB.QLB,,QBXQLB.LIB;
	
	The correction in this article is the same as for a different symptom
	described in a separate article, where garbage characters appear after
	selecting a menu at or to the right of the 64th column. To find this
	and other problems with the UI Toolbox, query in this Knowledge Base
	on the following words:
	
	   user and interface and toolbox and buglist7.00
