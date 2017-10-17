---
layout: page
title: "Q66307: Accessing Online Help for C and Assembly Topics with Same Name"
permalink: /pubs/pc/reference/microsoft/kb/Q66307/
---

## Q66307: Accessing Online Help for C and Assembly Topics with Same Name

	Article: Q66307
	Version(s): 2.01 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 23-OCT-1990
	
	QuickC with QuickAssembler versions 2.01 and 2.51 include online help
	for both C and Assembly topics. The Microsoft Advisor searches for C
	topics in the help file, QC.HLP, and for Assembly topics in QA.HLP.
	The manner in which the Advisor searches for topics is governed by the
	Language and Smart Help settings in the Display box under the Options
	menu.
	
	The following three possible Language settings determine the search
	order through the help files:
	
	   If Language Is:      Then:
	   ---------------      -----
	
	   C                    QC.HLP is searched first, then QA.HLP.
	
	   Assembler            QA.HLP is searched first, then QC.HLP.
	
	   Auto                 The file extension of the current file determines
	                        the search order. If it is not .ASM, the C
	                        defaults are used.
	
	Smart Help causes the Advisor to be insensitive to the presence or
	absence of leading underscores. For example, with Smart Help on,
	_dos_findfirst and dos_findfirst will bring up the same topic, while
	no help will be displayed on dos_findfirst with Smart Help turned off.
	In addition, Smart Help makes the search case insensitive.
	
	With the possible combinations of Language and Smart Help settings,
	attempting to access the online help system for topics defined in both
	C and Assembly may result in receiving help for only one language. For
	example, with the Language set to C and Smart Help activated, the
	following table shows a few instances where seeking help on certain
	Assembly topics results in help for the corresponding C topics:
	
	   Assembly Help Desired     C Help Actually Received
	   ---------------------     ------------------------
	
	      .EXIT                       exit()
	      SEGMENT                     _segment
	      IF                          if
	      IFNDEF                      #ifndef
	      INCLUDE                     #include
	
	The solution to this problem is changing the search order of the help
	files by changing the Language setting or forcing the search to be
	case sensitive by disabling Smart Help.
