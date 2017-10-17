---
layout: page
title: "Q66690: ALERT Function in BASIC 7.10 UI Toolbox Destroys TEXT&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q66690/
---

## Q66690: ALERT Function in BASIC 7.10 UI Toolbox Destroys TEXT&#36;

	Article: Q66690
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901030-181 buglist7.00 buglist7.10
	Last Modified: 14-NOV-1990
	
	The ALERT function in the User Interface (UI) Toolbox destroys the
	string sent to it in the TEXT$ field of the function call.
	
	Microsoft has confirmed this problem in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS. Suggested
	workarounds for this problem are shown below.
	
	Workarounds
	-----------
	
	Any one of the following workarounds will correct the problem but
	choices 1 and 2 may be easiest because they don't require recompiling
	WINDOW.BAS or building new UI Toolbox support libraries:
	
	1. Enclose the TEXT$ parameter in parentheses. For example, the
	   following statement
	
	      Alert(4, a$, 6, 20, 15, 60, "OK", "CANCEL", "")
	
	   should be changed to the following:
	
	      Alert(4, (a$), 6, 20, 15, 60, "OK", "CANCEL", "")
	
	2. Make a copy of the string before calling the ALERT function, as
	   follows:
	
	      temp$ = a$
	      ALERT(4, a$, 6, 20, 15, 60, "OK", "CANCEL", "")
	      a$ = temp$
	
	3. Modify the ALERT function in WINDOW.BAS as follows:
	
	      a. Right after the line that says
	
	            FUNCTION Alert (style, text$...
	
	         put the following statement:
	
	            TempText$ = test$
	
	       b. Right before the END FUNCTION at the bottom of the function,
	          put the following statement:
	
	             test$ = TempText$
	
	   You should then make a new Quick library (.QLB) and a new LINK
	   library (.LIB) that use the new version of ALERT, as shown in the
	   following:
	
	      BC /X/FS GENERAL.BAS;
	      BC /X/FS WINDOW.BAS;
	      BC /X/FS MOUSE.BAS;
	      BC /X/FS MENU.BAS
	      LIB UITB+GENERAL+WINDOW+MOUSE+MENU+UIASM+QBX.LIB;
	      LINK /Q UITB.LIB, UITB.QLB, , QBXQLB.LIB;
	
	   Invoke QBX.EXE using the new UITB.QLB Quick library, as follows:
	
	      QBX /L UITB
