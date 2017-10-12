---
layout: page
title: "Q41480: QuickC 2.00 README.DOC: Error Help"
permalink: /pubs/pc/reference/microsoft/kb/Q41480/
---

	Article: Q41480
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC 2.00 Version
	README.DOC file, part 1, "Notes on 'Up and Running.'" The following
	notes refer to specific pages in "Up and Running."
	
	Page 51   Error Help
	
	Add this note to the section on Error Help:
	
	Note: You can ask for help on all error messages and dialog boxes
	except this one:
	
	                  Warning!
	           Too many open help files
	Backtrace list and bookmarks will be invalidated
	------------------------------------------------
	
	Choosing <OK> lets you access the new help files, invalidating the
	backtrace list and bookmarks. Choosing <Cancel> aborts the request
	for Error Help, leaving the backtrace commands and bookmarks intact.
	
	This warning appears only when you have 20 files open at the same time,
	which is unlikely to occur. You can't ask for help about the message
	because the help system is unable to open any help files.
