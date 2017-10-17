---
layout: page
title: "Q60422: How to Run the CHRTDEMO.BAS Example Program"
permalink: /pubs/pc/reference/microsoft/kb/Q60422/
---

## Q60422: How to Run the CHRTDEMO.BAS Example Program

	Article: Q60422
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900329-119
	Last Modified: 11-APR-1990
	
	The CHRTDEMO.BAS example program requires several additional files to
	run properly. If any of these files is not loaded in the QBX.EXE
	environment, the "Subprogram not defined" error occurs. If any of the
	files are left out when LINKing, the "Unresolved external" LINK error
	occurs.
	
	The steps to set up the files to run CHRTDEMO (for either the QBX.EXE
	environment or as an EXE program) are documented in the banner
	comments at the beginning of CHRTDEMO.BAS.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	The following table shows the files required to run the CHRTDEMO
	example program and in which Quick library the modules are contained
	(Note: Assembly modules are contained in each QLB):
	
	   Source File    CHRTBEFR.QLB   UITBEFR.QLB
	   -----------    ------------   -----------
	
	   CHRTDEMO.BAS
	   CHRTDEM1.BAS
	   CHRTDEM2.BAS
	   CHRTB.BAS            X
	   FONTB.BAS            X
	   CHRTASM.ASM          X              X
	   FONTASM.ASM          X              X
	   UIASM.ASM            X              X
	   WINDOW.BAS                          X
	   MENU.BAS                            X
	   MOUSE.BAS                           X
	   GENERAL.BAS                         X
	
	In addition to the files listed above, expanded memory [with an LIM
	4.0 EMM (Expanded Memory Manager)] is required to run in the QBX.EXE
	environment. In EXE form, the program will run without EMS (expanded
	memory support).
	
	When running the CHRTDEMO program, you must first enter data through
	the dialog box for the Data option of the View menu. When the program
	begins, the Chart option of the View menu is gray, since there are no
	series to chart. If a chart is requested without data entered in any
	series, the following dialog box message appears:
	
	   No data in series.
	
	When entering the data, the Series name and Category labels are the
	same for the entire chart, but you must enter a different set of data
	for each series. Thus, the numbers entered in the Values column apply
	only to the currently selected Series. If an unnamed Series is
	selected, the values will be lost when OK is chosen to close the
	dialog box. When OK is chosen with data in an unnamed series, the
	following dialog box message appears:
	
	   Series without names will be deleted upon exit.
	
	The following banner comment from CHRTDEMO.BAS describes the steps
	(and memory requirements) to run the CHRTDEMO program in either the
	QBX.EXE environment or as an EXE program:
	
	' This demo program uses the Presentation Graphics and User
	' Interface toolboxes to implement a general purpose charting
	' package.
	'
	' It consists of three modules (CHRTDEMO.BAS, CHRTDEM1.BAS, and
	' CHRTDEM2.BAS) and one include file (CHRTDEMO.BI). It requires
	' access to both the Presentation Graphics and User Interface
	' toolboxes.
	'
	' EMS is needed to load and run the demo under QBX. If you do not
	' have EMS, refer to the command line compile instructions below,
	' which will allow you to run the demo from the DOS prompt. Running
	' the demo under QBX requires access to the Presentation Graphics
	' and User Interface toolboxes. This can be done using one of two
	' methods:
	'
	'   1. One large Quick library covering both toolboxes can be created.
	'      The library "CHRTDEM.LIB" and Quick library "CHRTDEM.QLB" are
	'      created as follows:
	'
	'         BC /X/FS chrtb.bas;
	'         BC /X/FS fontb.bas;
	'         LIB chrtdem.lib+uitbefr.lib+fontasm+chrtasm+fontb+chrtb;
	'         LINK /Q chrtdem.lib, chrtdem.qlb,,qbxqlb.lib;
	'
	'      Once created, start QBX with this Quick library and load the
	'      demo's modules (CHRTDEMO.BAS, CHRTDEM1.BAS and CHRTDEM2.BAS).
	'
	'   2. Either the Presentation Graphics or User Interface Quick Library
	'      may be used alone provided the other's source code files
	'      are loaded into the QBX environment. If CHRTBEFR.QLB is
	'      is used, then WINDOW.BAS, GENERAL.BAS, MENU.BAS, and MOUSE.BAS
	'      must be loaded. If UITBEFR.QLB is used, then CHRTB.BAS and
	'      FONTB.BAS must be loaded. Once a Quick Library is specified and
	'      all necessary source files are loaded, load the program
	'      modules (CHRTDEMO.BAS, CHRTDEM1.BAS and CHRTDEM2.BAS).
	'
	' To create a compiled version of the chart demo program, perform the
	' following steps:
	'
	'   BC /X/FS chrtb.bas;
	'   BC /X/FS fontb.bas;
	'   LIB chrtdem.lib + uitbefr.lib + fontasm + chrtasm + fontb
	'                   + chrtb;
	'   BC /X/FS chrtdemo.bas;
	'   BC /FS chrtdem1.bas;
	'   BC /FS chrtdem2.bas;
	'   LINK /EX chrtdemo chrtdem1 chrtdem2, chrtdemo.exe,, chrtdem.lib;
	'
	' "CHRTDEMO" can now be run from the command line.
