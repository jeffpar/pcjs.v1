---
layout: page
title: "Q62455: Invalid Entries in Symbol Table Using F1 in QB.EXE, QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62455/
---

## Q62455: Invalid Entries in Symbol Table Using F1 in QB.EXE, QBX.EXE

	Article: Q62455
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900517-174 B_BasicCom
	Last Modified: 2-JAN-1991
	
	Within the QB.EXE or QBX.EXE programming environment, if you create a
	variable of any type and then position the cursor on the variable and
	press F1, the Help window will appear, showing the type of the
	variable and how it is used in the program. If you then change the
	type of the variable and request help on the variable again, it will
	now be shown as being defined as both types, even though the variable
	appears in your program only once.
	
	This information applies to QB.EXE for QuickBASIC version 4.50 for
	MS-DOS, and QBX.EXE for Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Although the variable appears in the Help window as being defined as
	two variable types, memory is only allocated for the variable of the
	type it was last declared as. The symbol table used for displaying
	help on variables is updated only when QB.EXE or QBX.EXE is returned
	to the root state, which is when a new program is loaded or the
	current program is saved. To eliminate the duplicate entries, save the
	current program by pressing ALT+F, then "S" for Save or "A" for Save
	As. (The program does not need to be reloaded.)
	
	The following steps duplicate the problem:
	
	1. Load QB.EXE or QBX.EXE and type the following on a separate line:
	
	     x$ = ""
	
	2. Place the cursor on the "x$" and press F1 to get help on the
	   variable.
	
	3. With Help visible, change the line to read:
	
	      x = 0
	
	4. Place the cursor on the "x" and press F1 to get help on the
	   variable.
	
	You will now see the following in the Help window:
	
	   x is a symbol that is used in your program as follows:
	
	    | D:\TEST.BAS -----------------------
	    | variable of type: STRING
	    | variable of type: SINGLE precision
