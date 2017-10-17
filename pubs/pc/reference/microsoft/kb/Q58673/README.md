---
layout: page
title: "Q58673: ButtonOpen Incorrectly Handles Button in Resizable Window"
permalink: /pubs/pc/reference/microsoft/kb/Q58673/
---

## Q58673: ButtonOpen Incorrectly Handles Button in Resizable Window

	Article: Q58673
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900202-66 buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	The ButtonOpen SUBprogram in the User Interface (UI) Toolbox (in
	WINDOW.BAS) incorrectly handles buttons in resizable windows and
	buttons with invalid states. When trying to create a button with an
	invalid state (such as state 3 for window type 2), the following
	message displays and the program stops:
	
	   Cannot open button on window that can be re-sized.
	
	When you attempt to place a button in a resizable window, the above
	message is not displayed, but no button is created. In this case, the
	ButtonOpen SUB falls through without doing anything.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS. The necessary
	corrections to the WINDOW.BAS source code are listed below.
	
	For additional corrections to source code in the User Interface
	Toolbox, search in this Knowledge Base for the following words:
	
	   User and Interface and Toolbox and buglist7.00
	
	The section of code that must be modified is at the end of the
	ButtonOpen SUB from WINDOW.BAS (Note: The underscores are used for
	display purposes only):
	
	  IF (resize AND buttonType >= 6) OR NOT resize THEN
	...*** not all code displayed
	    IF (buttonType = 1 AND state >= 1 AND state <= 3)_
	    OR (buttonType >= 2 AND buttonType <= 3 AND state >= 1 AND state <= 2)_
	    OR (buttonType >= 4 AND buttonType <= 7) THEN
	...*** not all code displayed
	    ELSE
	        PRINT "Cannot open button on window that can be re-sized!"
	        END
	    END IF
	  END IF
	END SUB
	
	The problem with the existing code is that the ELSE clause matches the
	wrong level of the IF nesting. To modify the code to display correct
	messages, change the above code to the following:
	
	  IF (resize AND buttonType >= 6) OR NOT resize THEN
	  ...*** not all code displayed
	    IF (buttonType = 1 AND state >= 1 AND state <= 3)_
	    OR (buttonType >= 2 AND buttonType <= 3 AND state >= 1 AND state <= 2)_
	    OR (buttonType >= 4 AND buttonType <= 7) THEN
	    ...*** not all code displayed
	
	'The following lines have changed.
	    ELSE
	      PRINT "Illegal state ("; state; ") or button type ("; buttonType; ")"
	      END
	    END IF
	  ELSE
	    PRINT "Cannot open button on window that can be re-sized!"
	    END
	  END IF
	END SUB
	
	The following code examples demonstrate the two problems with the
	unmodified ButtonOpen SUB:
	
	Example 1
	---------
	
	This first example attempts to open a button, type 2 (check box), with
	an invalid state, 3. This program displays the following incorrect
	message using the unmodified code shipped with BASIC PDS 7.00 or 7.10:
	
	   Cannot open button on window that can be re-sized.
	
	After making the specified modifications to WINDOW.BAS, Example 1
	displays the following correct message:
	
	   Illegal state ( 3 ) or button type ( 2 )
	
	REM $INCLUDE: 'General.bi'
	REM $INCLUDE: 'Mouse.bi'
	REM $INCLUDE: 'Menu.bi'
	REM $INCLUDE: 'Window.bi'
	COMMON SHARED /uitools/ GloMenu           AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle()        AS MenuTitleType
	COMMON SHARED /uitools/ GloItem()         AS MenuItemType
	COMMON SHARED /uitools/ GloWindow()       AS windowType
	COMMON SHARED /uitools/ GloButton()       AS buttonType
	COMMON SHARED /uitools/ GloEdit()         AS EditFieldType
	COMMON SHARED /uitools/ GloStorage        AS WindowStorageType
	COMMON SHARED /uitools/ GloWindowStack()  AS INTEGER
	COMMON SHARED /uitools/ GloBuffer$()
	'$DYNAMIC
	DIM GloWindow(MAXWINDOW) AS windowType
	DIM GloWindowStack(MAXWINDOW) AS INTEGER
	DIM GloButton(MAXBUTTON) AS buttonType
	DIM GloEdit(MAXBUTTON) AS EditFieldType
	DIM GloBuffer$(MAXWINDOW + 1, 2)
	CLS
	WindowInit
	Resize% = 0               'Not resizable
	WindowOpen 1, 3, 3, 24, 24, 7, 0, 7, 0, 7, 7, 7, Resize%, 0, 1, "test"
	buttonType% = 2              'Check box (valid states=1 and 2)
	state% = 3                   '3 is invalid state for check box
	CALL ButtonOpen(1, state%, "Foo", 10, 10, 20, 20, buttonType%)
	
	Example 2
	---------
	
	The following example attempts to open a button in a resizable window.
	This program executes without messages using the unmodified code
	shipped with BASIC PDS 7.00 or 7.10, but no button is created.
	
	After making the specified modifications to WINDOW.BAS, Example 2
	displays the following correct message:
	
	   Cannot open button on window that can be re-sized.
	
	REM $INCLUDE: 'General.bi'
	REM $INCLUDE: 'Mouse.bi'
	REM $INCLUDE: 'Menu.bi'
	REM $INCLUDE: 'Window.bi'
	COMMON SHARED /uitools/ GloMenu           AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle()        AS MenuTitleType
	COMMON SHARED /uitools/ GloItem()         AS MenuItemType
	COMMON SHARED /uitools/ GloWindow()       AS windowType
	COMMON SHARED /uitools/ GloButton()       AS buttonType
	COMMON SHARED /uitools/ GloEdit()         AS EditFieldType
	COMMON SHARED /uitools/ GloStorage        AS WindowStorageType
	COMMON SHARED /uitools/ GloWindowStack()  AS INTEGER
	COMMON SHARED /uitools/ GloBuffer$()
	'$DYNAMIC
	DIM GloWindow(MAXWINDOW) AS windowType
	DIM GloWindowStack(MAXWINDOW) AS INTEGER
	DIM GloButton(MAXBUTTON) AS buttonType
	DIM GloEdit(MAXBUTTON) AS EditFieldType
	DIM GloBuffer$(MAXWINDOW + 1, 2)
	CLS
	WindowInit
	Resize% = TRUE                 'Resizable
	WindowOpen 1, 3, 3, 24, 24, 7, 0, 7, 0, 7, 7, 7, Resize%, 0, 1, "test"
	buttonType% = 2
	state% = 1                     'Valid state.
	CALL ButtonOpen(1, state%, "Foo", 10, 10, 20, 20, buttonType%)
