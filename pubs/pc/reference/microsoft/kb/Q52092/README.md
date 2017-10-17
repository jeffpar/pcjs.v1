---
layout: page
title: "Q52092: &quot;Subscript out of Range in Quick Library Module: MENU&quot; in 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q52092/
---

## Q52092: &quot;Subscript out of Range in Quick Library Module: MENU&quot; in 7.00

	Article: Q52092
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891207-103
	Last Modified: 2-MAY-1990
	
	A program that uses procedures in the User Interface Toolbox's
	WINDOW.BAS source-code file may generate the message "Subscript out
	of range in module: MENU," if either the global-array declarations
	used with MENU.BAS are not included in the program or if they are
	included in the wrong order.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS.
	
	When using procedures in WINDOW.BAS, you must include the global-array
	declarations used with MENU.BAS in addition to the global-array
	declarations that are specific to WINDOW.BAS.
	
	The MENU.BAS COMMON SHARED statements must be listed before the
	WINDOW.BAS COMMON SHARED statements or a "Subscript out of range in
	module: MENU" error occurs.
	
	When using procedures in WINDOW.BAS, you make the following
	global-array declarations in your program. The COMMON SHARED
	statements must be listed in the exact order shown. The order of the
	DIM statements does NOT matter.
	
	'COMMON SHARED statements to be used with MENU.BAS:
	
	        COMMON SHARED /uitools/ GloMenu       AS MenuMiscType
	        COMMON SHARED /uitools/ GloTitle()    AS MenuTitleType
	        COMMON SHARED /uitools/ GloItem()     AS MenuItemType
	
	'COMMON SHARED statements WINDOW.BAS:
	
	        COMMON SHARED /uitools/ GloWindow()   AS WindowType
	        COMMON SHARED /uitools/ GloButton()   AS ButtonType
	        COMMON SHARED /uitools/ GloEdit()     AS EditFieldType
	        COMMON SHARED /uitools/ GloStorage    AS WindowStorageType
	        COMMON SHARED /uitools/ GloWindowStack() AS INTEGER
	        COMMON SHARED /uitools/ GloBuffer$()
	
	'DIM statements to be used with MENU.BAS:
	
	        DIM GloTitle(MAXMENU)                 AS MenuTitleType
	        DIM GloItem(MAXMENU, MAXITEM)         AS MenuItemType
	
	'DIM statements to be used with WINDOW.BAS:
	
	        DIM GloWindow(MAXWINDOW)              AS WindowType
	        DIM GloButton(MAXBUTTON)              AS ButtonType
	        DIM GloEdit(MAXEDITFIELD)             AS EditFieldType
	        DIM GloWindowStack(MAXWINDOW)         AS INTEGER
	        DIM GloBuffer$(MAXWINDOW + 1, 2)
