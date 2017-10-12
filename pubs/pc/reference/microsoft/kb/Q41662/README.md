---
layout: page
title: "Q41662: QuickC 2.00 README.DOC: Creating a Help Database"
permalink: /pubs/pc/reference/microsoft/kb/Q41662/
---

	Article: Q41662
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page  185  Creating a Help Database
	
	Add these paragraphs to step 4 at the top of the page:
	
	If you would prefer not to append the new file to QC.HLP, you may set
	the environment variable HELPFILES to equal the help files you've
	created. For example, to force on-line help to search HANSEL.HLP and
	GRETEL.HLP (in addition to the standard help files), enter this
	command line or add it to your AUTOEXEC.BAT.
	
	   SET HELPFILES=HANSEL.HLP;GRETEL.HLP
	
	QuickC's on-line help system can search up to 10 files. This includes
	the four standard help files (QC.HLP, OCENV.HLP, ERROR.HLP and
	GRAPHICS.HLP) and up to six user-defined files.
