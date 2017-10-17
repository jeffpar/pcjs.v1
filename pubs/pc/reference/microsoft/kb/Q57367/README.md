---
layout: page
title: "Q57367: COMMON SHARED Must Be in Order in User Interface Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q57367/
---

## Q57367: COMMON SHARED Must Be in Order in User Interface Toolbox

	Article: Q57367
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891211-54
	Last Modified: 23-FEB-1990
	
	When using procedures from the User Interface (UI) Toolbox's MENU.BAS
	or WINDOW.BAS, you must provide global-array declarations in your
	program. If these declarations are in the wrong order, various errors
	may occur. The proper order for COMMON SHARED declarations can be
	found at the beginning of each User Interface Toolbox .BAS file.
	Possible errors include "Subscript out of range in module...," "Far
	Heap Corrupt," or the system may hang.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	In most cases, switching the order of the COMMON SHARED statements for
	the global-array declarations generates the error "Subscript out of
	range in module..." on the first call to a procedure in MENU.BAS or
	WINDOW.BAS.
	
	Changing the order of certain COMMON SHARED statements results in a
	"Far Heap Corrupt" message when the program is run from the QBX.EXE
	editor. This can put the computer in an unstable memory state, which
	may cause it to hang. When the same program is run from the DOS
	command line, the program fails and gives a "Subscript out of range in
	module..." error message.
	
	Here is some good advice from Page 65 of the "Microsoft BASIC 7.0:
	Language Reference" manual:
	
	   Errors caused by mismatched COMMON statements are subtle and
	   difficult to find. An easy way to avoid mismatched COMMON
	   statements is to place COMMON declarations in a single include
	   file and use the $INCLUDE metacommand in each module.
	
	Code Example
	------------
	
	The following code exhibits the behavior of a program that has a
	statement (COMMON SHARED /uitools/GloWindowStack() AS INTEGER) in the
	wrong order. This program generates a "Far Heap Corrupt" message and
	can hang when run from the QBX.EXE editor in either MS-DOS or in OS/2
	real mode. If this program is compiled, linked, and then run from the
	DOS command line, it generates a "Subscript out of range in module..."
	error.
	
	   REM $INCLUDE: 'MENU.BI'
	   REM $INCLUDE: 'WINDOW.BI'
	   REM $INCLUDE: 'MOUSE.BI'
	   REM $INCLUDE: 'GENERAL.BI'
	
	   COMMON SHARED /uitools/GloMenu     AS MenuMiscType
	   COMMON SHARED /uitools/GloTitle()  AS MenuTitleType
	   COMMON SHARED /uitools/GloItem()   AS MenuItemType
	
	   'The next statement is out of order
	
	   COMMON SHARED /uitools/GloWindowStack() AS INTEGER
	   COMMON SHARED /uitools/GloWindow() AS WindowType
	   COMMON SHARED /uitools/GloButton() AS ButtonType
	   COMMON SHARED /uitools/GloEdit()   AS EditFieldType
	   COMMON SHARED /uitools/Storage     AS WindowStorageType
	   'This is where the statement should be
	   COMMON SHARED /uitools/GloBuffer$()
	
	   DIM GloTitle(MAXMENU)              AS MenuTitleType
	   DIM GloItem(MAXMENU, MAXITEM)      AS MenuItemType
	   DIM GloWindow(MAXWINDOW)           AS WindowType
	   DIM GloButton(MAXBUTTON)           AS ButtonType
	   DIM GloEdit(MAXEDITFIELD)          AS EditFieldType
	   DIM GloWindowStack(MAXWINDOW)      AS INTEGER
	   DIM GloBuffer$(MAXWINDOW +1, 2)
	
	   MenuInit
	   WindowInit
