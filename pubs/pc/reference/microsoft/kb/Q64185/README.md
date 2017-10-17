---
layout: page
title: "Q64185: PRINT USING Doesn't Work in UI Toolbox Window; Use FormatX&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q64185/
---

## Q64185: PRINT USING Doesn't Work in UI Toolbox Window; Use FormatX&#36;

	Article: Q64185
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900717-4
	Last Modified: 27-JUL-1990
	
	The WindowPrint subroutine included in the User Interface (UI) Toolbox
	allows you to print text strings inside a window that was defined with
	the WindowOpen UI subroutine. However, the WindowPrint subroutine does
	not allow you to print numbers or formatted numbers the same way a
	PRINT USING statement does. To print numbers or formatted numbers, you
	must first use the FormatX$ functions, available in the BASIC PDS
	Add-on Library DTFMTxx.LIB. The string of numbers formatted with
	FormatX$ can then be printed with the WindowPrint subroutine.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The term FormatX$ actually refers to the functions FormatI$, FormatL$,
	FormatS$, FormatD$, and FormatC$. For more information on the FormatX$
	functions, query in this Knowledge Base on the word "FormatX$".
	
	To use the FormatX$ functions with the User Interface Toolbox in the
	QBX.EXE environment, you must first create a Quick library (a .QLB
	file) containing the code for both the User Interface routines and
	also the FormatX$ routines. Here are two methods to do this:
	
	Method 1
	--------
	
	To create the Quick library from provided .LIB libraries, combine the
	libraries into a new library as follows
	
	   LIB UITFMT.LIB+UITBEFR.LIB ;
	   LIB UITFMT.LIB+DTFMTER.LIB ;
	
	then create the new Quick library (UITFMT.QLB) as follows:
	
	   LINK /Q UITFMT.LIB, UITFMT.QLB,,QBXQLB.LIB ;
	
	Note that the first LIB command line above creates UITFMT.LIB. LIB.EXE
	creates UITFMT.LIB automatically since UITFMT.LIB did not previously
	exist. The second LIB command line appends DTFMTER.LIB to UITFMT.LIB.
	
	To invoke QBX.EXE (the QuickBASIC Extended environment) with the
	UITFMT.QLB Quick library (created in Method 1 above), use the
	following command:
	
	   QBX /L UITFMT.QLB
	
	Method 2
	--------
	
	To create the .QLB file from the original .OBJ files, use the
	following LINK command:
	
	   LINK /q WINDOW.OBJ+MENU.OBJ+MOUSE.OBJ+GENERAL.OBJ+UIASM.OBJ+
	                        QBX.LIB+DTFMTER.LIB,UIFMT.QLB,,QBXQLB.LIB;
	
	Note: In the preceding LINK line, you must use DTFMTER.LIB, where "E"
	stands for Emulator math package, and "R" stands for DOS real mode.
	Quick libraries used in QBX.EXE cannot be compiled for Alternate math
	or protected mode.
	
	To invoke QBX.EXE (QuickBASIC Extended) with the UIFMT.QLB Quick
	library (created in Method 2 above), use the following command:
	
	   QBX /L UIFMT.QLB
	
	To use the UI Toolbox routines and the FormatX$ routines in an
	executable (.EXE) program, you must link to the UITFMT.LIB (created in
	Method 1 above) to your program, or separately link the DTFMTxx.LIB
	and UITBxxx.LIB libraries (shipped by Microsoft) into your program.
	
	The following code sample gives an example of using the FormatS$
	function to convert a single-precision number into a dollar amount,
	and then print the result in a UI Toolbox window:
	
	Code Sample
	-----------
	
	DEFINT A-Z
	REM $INCLUDE: 'window.bi'
	REM $INCLUDE: 'mouse.bi'
	REM $INCLUDE: 'menu.bi'
	REM $INCLUDE: 'general.bi'
	REM $INCLUDE: 'format.bi'
	
	COMMON SHARED /uitools/ glomenu AS menumisctype
	COMMON SHARED /uitools/ glotitle() AS menutitletype
	COMMON SHARED /uitools/ gloitem() AS menuitemtype
	COMMON SHARED /uitools/ glowindow() AS windowtype
	COMMON SHARED /uitools/ globutton() AS buttontype
	COMMON SHARED /uitools/ gloedit() AS editfieldtype
	COMMON SHARED /uitools/ glostorage AS windowstoragetype
	COMMON SHARED /uitools/ glowindowstack() AS INTEGER
	COMMON SHARED /uitools/ globuffer$()
	
	DIM glotitle(maxmenu) AS menutitletype
	DIM gloitem(maxmenu, maxitem) AS menuitemtype
	DIM glowindow(MAXWINDOW) AS windowtype
	DIM globutton(MAXBUTTON) AS buttontype
	DIM gloedit(MAXEDITFIELD) AS editfieldtype
	DIM glowindowstack(MAXWINDOW) AS INTEGER
	DIM globuffer$(MAXWINDOW + 1, 2)
	
	CLS
	MenuInit
	windowinit
	
	windowopen 1, 3, 3, 20, 40, 7, 0, 7, 0, 15, 0, 0, 0, 0, 1, "Format Example"
	' Set the variable name:
	a! = 123.34
	
	' Convert the variable to a string:
	b$ = STR$(a!)
	
	'convert the variable to a formatted string:
	x$ = formats$(a!, "$0000.00")
	
	' Print out the results:
	
	windowprint 1, "The unformatted variable is:"
	windowprint 1, b$
	windowprint 1, "The formatted variable using the"
	windowprint 1, "form '$0000.00':"
	windowprint 1, x$
