---
layout: page
title: "Q61235: C 6.00 README: Using a Large Number of Help Files"
permalink: /pubs/pc/reference/microsoft/kb/Q61235/
---

## Q61235: C 6.00 README: Using a Large Number of Help Files

	Article: Q61235
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Using a Large Number of Help Files
	----------------------------------
	
	If the help files for OS/2 and several different languages are loaded
	onto your system, you may receive a message that you have too many
	help files open.
	
	You can get around this problem by concatenating some of the help
	files. Most applications that display help allow up to 19 open
	physical help files. However, the number of logical (that is,
	concatenated) help files allowed is usually much larger.
	
	To concatenate help files, use the DOS or OS/2 COPY command with the
	/B (binary) option. For example, to concatenate LINK.HLP and UTILS.HLP
	into a single help file called COMBO.HLP, use the following command:
	
	   COPY LINK.HLP /B + UTILS.HLP /B COMBO.HLP /B
	
	The order in which you concatenate the files determines the order in
	which the files are searched for help information.
	
	As a final step, be sure to delete the original help files, or move
	them to a directory that is not listed in your HELPFILES environment
	variable.
