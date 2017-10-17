---
layout: page
title: "Q58603: MHELP Driver Not Completely Compatible with QuickC Help Files"
permalink: /pubs/pc/reference/microsoft/kb/Q58603/
---

## Q58603: MHELP Driver Not Completely Compatible with QuickC Help Files

	Article: Q58603
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc buglist1.02
	Last Modified: 5-MAR-1990
	
	The MHELP driver cannot process some cross-references inherent to the
	QuickC Versions 2.00 and 2.01 help files. Results range from the MHELP
	message "Cannot Process Cross Reference," to hanging the computer. In
	general, direct reference to a QuickC help file from within the editor
	is fine. However, moving around within the help file system using the
	built-in cross-references produces unpredictable results.
	
	The MHELP driver seems unable to access unformatted text files such as
	header, source, and DOC files. For example, QuickC allows you to
	access both the README.DOC file and QuickC header files from within
	the help system. Attempting these feats from within M leads to one of
	the following problems:
	
	1. "Cannot Process Cross Reference," if file not found.
	
	2. DOS will hang the machine if the file is found.
	
	3. OS/2 may cause a SYS 1943 protection violation if the file is
	   found.
	
	The M editor also cannot use the <back> menu option to access a
	previously viewed help file. Attempting this yields the message
	"Cannot Process Cross Reference" at the bottom of the screen. The
	syntax of the <back> cross-reference in unencrypted help form is
	help file to access the previous help screen. This undocumented
	feature is not allowed in MHELP.
	
	Certain series of cross references cause sporadic errors. You should
	be careful to avoid internal cross-referencing within the QC help
	files. The problem can be shown with the following sequence using the
	QuickC and QuickAssembler help files from within the M Editor.
	
	   <arg> seg <F1> <TAB> <RETURN> <TAB> <RETURN> <TAB>
	
	This example reaches the help-contents window via the "seg" example
	program. Upon reaching this point, it may hang DOS with the run-time
	error R6003 or R6001. OS/2 displays a black box in the upper-right
	corner of the screen and may crash at this point.
	
	Microsoft has confirmed this to be a problem with the M Editor Version
	1.02. We are researching this problem and will post new information
	here as it becomes available.
