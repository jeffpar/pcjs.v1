---
layout: page
title: "Q60425: Unresolved External Making Quick Library from CHRTB.BAS"
permalink: /pubs/pc/reference/microsoft/kb/Q60425/
---

## Q60425: Unresolved External Making Quick Library from CHRTB.BAS

	Article: Q60425
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900402-93 docerr
	Last Modified: 8-JAN-1991
	
	The CHRTB.BAS file contains BASIC source code for the Presentation
	Graphics Toolbox Chart Routines.
	
	At the beginning of this file, there are instructions for creating a
	library and Quick library that contain the charting routines found in
	CHRTB.BAS. However, numerous unresolved external link errors (L2029)
	will be produced unless alterations are made to these instructions.
	
	This documentation error occurs in the CHRTB.BAS file in Microsoft
	BASIC Professional Development System (PDS) Versions 7.00 and 7.10 for
	MS-DOS.
	
	Since CHRTB.BAS makes calls to routines found in the Fonts Toolbox,
	FONTB.OBJ and FONTASM.OBJ must be included when making a library or
	Quick library out of CHRTB.BAS. These two files were mistakenly
	omitted from the instructions found in the CHRTB.BAS file.
	
	The correct method of creating a library and Quick library containing
	the charting routines found in CHRTB.BAS is as follows:
	
	   BC /X /FS chrtb.bas
	   BC /X /FS fontb.bas
	   LIB chrtb.lib +chrtb+chrtasm+fontb+fontasm+qbx.lib;
	   LINK /Q chrtb.lib, chrtb.qlb,,qbxqlb.lib;
	
	If the charting routines are going to be used in conjunction with the
	User Interface Toolbox source code (GENERAL.BAS, WINDOW.BAS, MENU.BAS,
	and MOUSE.BAS), the library should instead be created in the following
	manner:
	
	   LIB chrtb.lib +chrtb+chrtasm+uiasm+fontb+fontasm+qbx.lib;
