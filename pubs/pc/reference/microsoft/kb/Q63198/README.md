---
layout: page
title: "Q63198: Main Module Must Be First BASIC File in Program List for PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q63198/
---

## Q63198: Main Module Must Be First BASIC File in Program List for PWB

	Article: Q63198
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900618-147 S_PWB PWB
	Last Modified: 5-SEP-1990
	
	The main module in a multiple-module program must be listed as the
	first BASIC source file in the Program List for PWB.EXE (the
	Programmer's WorkBench) to properly make the EXE file. If a
	supporting module is listed first, its module-level code (virtually
	nonexistent in most cases) is treated as the main entry point. This
	produces an EXE that is approximately the correct size, but does
	nothing.
	
	To convert a given module in the Program List to the main module,
	choose that module in the Edit Program List dialog and choose the To
	Top Of List button.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.10 for MS-DOS and MS OS/2.
	
	For example, to make a Program List containing everything necessary
	for the UIDEMO example program, UIDEMO.BAS must be listed at the
	beginning of the BASIC files list. The incorrect and correct orders
	are demonstrated below.
	
	The following order of files does NOT create a working UIDEMO.EXE:
	
	   GENERAL.BAS
	   MENU.BAS
	   MOUSE.BAS
	   UIDEMO.BAS
	   WINDOW.BAS
	   UIASM.OBJ
	   QBX.LIB
	
	The above order does not work because GENERAL is taken as the main
	module. Since GENERAL.BAS has no executable statements at the module
	level, the program does nothing when run.
	
	The correct order must have UIDEMO.BAS first:
	
	   UIDEMO.BAS
	   GENERAL.BAS
	   MENU.BAS
	   MOUSE.BAS
	   WINDOW.BAS
	   UIASM.OBJ
	   QBX.LIB
