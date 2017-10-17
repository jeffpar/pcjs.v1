---
layout: page
title: "Q66140: How to Change User Interface Global CONSTants in GENERAL.BI"
permalink: /pubs/pc/reference/microsoft/kb/Q66140/
---

## Q66140: How to Change User Interface Global CONSTants in GENERAL.BI

	Article: Q66140
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900313-103
	Last Modified: 18-OCT-1990
	
	The GENERAL.BI $INCLUDE file in the User Interface (UI) Toolbox, which
	comes with Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10, contains several global constants (defined
	with CONST) that dictate how the Toolbox FUNCTIONs and SUBs will
	behave. When one of these CONSTants is changed, the entire Toolbox
	usually must be recompiled and linked, all libraries must be rebuilt,
	and the quick libraries must be rebuilt. This article gives
	instructions for this process.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	To change the constants in the UI $INCLUDE files, follow these steps:
	
	1. Load the file GENERAL.BI into any editor (such as QBX.EXE).
	
	2. Move the cursor down to the Global Constants section.
	
	3. Change the CONSTant.
	
	4. Save the GENERAL.BI file.
	
	5. If you are loading the entire source code for the Toolbox into the
	   QBX.EXE editor, then you can just load and run the current program
	   and the changes will take effect.
	
	Most people use the Toolbox in the form of a compiled library or Quick
	library. To enable these changes to take effect in your Quick library
	or library, you must recompile and create both UITBEFR.QLB and
	UITBxxx.LIB. The "xxx" depends on what compiler options you use to
	create your final .EXE application and what compiler options you use
	to create the Toolbox.
	
	Within the QBX.EXE environment, you must use UITBEFR.QLB (which
	supports the emulator library, far strings, and real-mode). Therefore,
	a full example is provided here of altering UITBEFR.LIB and
	UITBEFR.QLB. To re-create these files, use the following commands (as
	shown in the form of an MS-DOS batch file to make rebuilding the
	libraries easier):
	
	   REM  Recompile the four BASIC modules which make the Toolboxes
	   REM  Note that the .OBJ names below MUST be used:
	   BC /x /Fs /Lr /FPi GENERAL.BAS, GENEREFR.OBJ;
	   BC /x /Fs /Lr /FPi MOUSE.BAS,   MOUSEEFR.OBJ;
	   BC /x /Fs /Lr /FPi MENU.BAS,    MENUEFR.OBJ ;
	   BC /x /Fs /Lr /FPi WINDOW.BAS,  WINDOEFR.OBJ;
	
	   REM  Replace the existing modules in the UITBEFR.LIB. Note that
	   REM  the following command should be on just one DOS command line:
	 LIB UITBEFR.LIB -+GENEREFR.OBJ -+ MOUSEEFR.OBJ -+MENUEFR.OBJ -+WINDOEFR.OBJ;
	
	   REM  Don't forget to save the old version of your library in case
	   REM  an error occurs:
	   RENAME UITBEFR.QLB UITBEFR.BAK
	
	   REM  Link the new Quick library:
	   LINK /q UITBEFR.LIB, UITBEFR.QLB,,QBXQLB.LIB;
	
	If you want to modify any of the other UITBxxx.LIB libraries, then the
	BC compile and LIB commands given above can easily be modified to work
	properly with all of these other libraries.
	
	The global constants that can be changed in GENERAL.BI are: FALSE,
	TRUE, MINROW, MAXROW, MINCOL, MAXCOL, MAXMENU, MAXITEM, MAXWINDOW,
	MAXBUTTON, MAXEDITFIELD, and MAXHOTSPOT. For a description of these
	constants, see page 533 of the "Microsoft BASIC 7.0: BASIC Language
	Reference."
