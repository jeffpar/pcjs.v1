---
layout: page
title: "Q48743: QuickC 2.00 Fails with Self-Relative PATH Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q48743/
---

	Article: Q48743
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM buglist2.00 buglist2.01
	Last Modified: 10-OCT-1989
	
	QC.EXE and QCL.EXE behave differently from LINK.EXE and NMAKE.EXE when
	loaded under specific PATH settings, specifically when the pathname is
	relative to the directory containing QC.EXE and QCL.EXE.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
	
	The following demonstrate the differences. In all cases, QC.EXE is in
	C:\QC2\BIN:
	
	Case 1: (Different Behavior)
	----------------------------
	
	PATH=..
	CD C:\QC2\BIN\B          (an immediate subdirectory)
	QC                       (Get 'Program is not on search path' message)
	QCL                      (Get Microsoft copyright)
	LINK                       "      "        "
	NMAKE                      "      "        "
	
	Case 2: (Different Behavior)
	----------------------------
	
	PATH=QC2\BIN
	CD \                     (root directory)
	QC                       (Get 'Program is not on search path' message)
	QCL                      (Get Microsoft copyright)
	LINK                       "    "   "
	NMAKE                      "    "   "
	
	Case 3: (Different Behavior)
	----------------------------
	
	MD C:\QC2\BIN\B\M
	PATH=M\..\..
	CD C:\QC2\BIN\B
	QC                       (EXEC failure)
	QCL                         "     "
	LINK                     (Access denied)
	NMAKE                       "       "
	
	The directories "B" and "M" can be changed to any other name to
	produce the error, as long as M is a single character name. If M is
	renamed to a name with more than one character, the message "Program
	is not on search path" occurs.
	
	Case 4: (All Invocations Perform Properly)
	------------------------------------------
	
	PATH=C:\QC2\BIN\B\..     (or PATH=\QC2\BIN\B\..)
	CD \                     (or CD C:\QC2\BIN\B)
	QC                       (loads QC environment)
	QCL                      (Get Microsoft copyright)
	LINK                       "      "        "
	NMAKE                      "      "        "
