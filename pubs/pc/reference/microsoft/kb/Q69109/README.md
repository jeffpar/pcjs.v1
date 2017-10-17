---
layout: page
title: "Q69109: &quot;Illegal Function Call&quot; Selecting Menu Item Using UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q69109/
---

## Q69109: &quot;Illegal Function Call&quot; Selecting Menu Item Using UI Toolbox

	Article: Q69109
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901120-94
	Last Modified: 14-FEB-1991
	
	An "Illegal function call" error can occur when you select an item
	from a user-defined menu with the ALT+Key1+Key2 combination, even
	though selecting the same item with the mouse does not give an error.
	This error can be caused by using an incorrect parameter in the
	MenuSet procedure. The fifth argument of the MenuSet SUB is
	accesskey%. If zero is passed as the fifth parameter, then that menu
	item and any after it will generate an error when selected with key
	combinations. This error does not occur if you use the mouse. This
	article shows why this error occurs, and gives a workaround for this
	problem.
	
	This information applies to the User Interface (UI) Toolbox in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	The MenuSet SUB is described on pages 545 and 546 of the "Microsoft
	BASIC 7.0: Programmer's Guide" for versions 7.00 and 7.10.
	
	The accesskey% argument specifies the position of the character within
	the menu item text that is used in conjunction with the ALT key to
	select that item. You may want accesskey% to be zero if you don't want
	the item to be selected. If you don't want the item to be selected,
	pass a zero as the third parameter (the State% argument).
	
	Code Example
	------------
	
	The following code example demonstrates the "Illegal function call"
	error. In this case, a zero is passed as the fifth parameter of
	MenuSet because the text is just a horizontal line across the menu.
	
	To run this example, save the code as <filename>.BAS, then invoke
	QBX.EXE with the following command:
	
	QBX <filename> /L UITBEFR
	
	' UIERROR.BAS
	DEFINT A-Z
	'$DYNAMIC
	'$INCLUDE: 'GENERAL.BI'
	'$INCLUDE: 'MENU.BI'
	'$INCLUDE: 'MOUSE.BI'
	'$INCLUDE: 'WINDOW.BI'
	
	'These global variables are required by the UI Toolbox routines:
	COMMON SHARED /uitools/ GloMenu         AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle()      AS MenuTitleType
	COMMON SHARED /uitools/ GloItem()       AS MenuItemType
	
	'******************************************************************
	'MAXMENU and MAXITEM are constants defined in *.BI above.
	'The TYPEs MenuTitleType and MenuItemType are also defined
	'in the *.BI files above.
	'******************************************************************
	DIM GloTitle(MaxMenu)         AS MenuTitleType
	DIM GloItem(MaxMenu, MaxItem) AS MenuItemType
	COLOR 2, 1
	CLS
	MenuInit
	COLOR 15, 1                       'Sets the background to blue
	MenuSet 1, 0, 1, "Salutation", 1  'Menu title
	MenuSet 1, 1, 1, "Hello", 1       'First item under Salutation
	MenuSet 1, 2, 1, "-", 0           'Line across the menu
	MenuSet 1, 3, 1, "Goodbye", 1     'Last item under Salutation
	MenuPreProcess
	MenuShow
	MouseShow
	ProgramFinished = False
	WHILE NOT ProgramFinished
	  kbd$ = MenuInkey$
	  WHILE MenuCheck(2)
	    GOSUB MenuTrap
	  WEND
	WEND
	MouseHide
	END
	
	MenuTrap:
	  Menu = MenuCheck(0)
	  item = MenuCheck(1)
	  COLOR 2, 1
	  SELECT CASE Menu
	    CASE 1
	      SELECT CASE item
	        CASE 1                        'If hello was selected then
	          LOCATE 12, 37               'print hello.
	          PRINT "Hello"
	        CASE 3                        'If goodbye was selected then
	          LOCATE 13, 36               'print goodbye and end.
	          PRINT "GoodBye"
	          ProgramFinished = True
	        CASE ELSE
	          ProgramFinished = False
	      END SELECT
	    CASE ELSE
	      ProgramFinished = False
	  END SELECT
	  RETURN
	
	Workaround
	----------
	
	This problem can be solved by either not passing a zero as the fifth
	parameter in MenuSet or by changing a few lines of code in the
	MENU.BAS program. The problem lies in the MENU.BAS program in the
	MenuDo SUB. There is a DO LOOP shortly after the following comment:
	
	'==================================================================
	'If menu is selected, search items for matching access key, and
	'select that (menu,item) and exit MenuDo if item is enabled
	'==================================================================
	
	The LOOP statement reads:
	
	LOOP UNTIL UCASE$(MID$(GloItem(currMenu, newItem).text,_
	GloItem(currMenu, newItem.accesskey,1)) = kbd$ AND GloItem(currMenu,_
	newItem).state > 0 AND RTRIM$(GloItem(currMenu, newItem).text) <>_
	"-") OR newItem = loopEnd
	
	Note: The above is one line of code in MENU.BAS. The underscore (_)
	characters indicate line continuation.
	
	If zero was passed as the fifth parameter in MenuSet, then
	GloItem(currMenu, newItem).accesskey = 0 when the loop reaches that
	menu item. This condition causes an "illegal function call" in the
	MID$ function. Adding the following IF statement to the loop will
	solve the problem:
	
	DO
	  newItem = (newItem) MOD MAXITEM + 1
	  IF GloItem(currMenu, newItem).accesskey = 0 THEN
	    LoopDone% = (newItem = loopEnd)
	  ELSE
	    LoopDone% = UCASE$(MID$(GloItem(currMenu, newItem).text,_
	    GloItem(currMenu, newItem.accesskey,1)) = kbd$ AND_
	    GloItem(currMenu, newItem).state > 0 AND RTRIM$(GloItem(currMenu,_
	    newItem).text) <> "-") OR newItem = loopEnd
	  END IF
	LOOP UNTIL LoopDone%
	
	To include these changes in the files UITBEFR.LIB and UITBEFR.QLB, do
	the following:
	
	1. At the DOS prompt, type:
	
	      QBX MENU
	
	2. Make the changes in the DO LOOP as stated above.
	
	3. Save the new MENU.BAS.
	
	4. Exit QBX.EXE.
	
	5. At the DOS prompt, type:
	
	      BC MENU /X/Fs;
	
	6. Type:
	
	      LIB UITBEFR - MENU.OBJ + MENU.OBJ
	
	7. Type:
	
	      LINK /Q UITBEFR.LIB, UITBEFR.QLB,, QBXQLB.LIB;
