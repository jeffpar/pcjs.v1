---
layout: page
title: "Q36578: &quot;Bad File Mode&quot; Loading 4.50 Fast Load Format File into 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q36578/
---

## Q36578: &quot;Bad File Mode&quot; Loading 4.50 Fast Load Format File into 4.00

	Article: Q36578
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-DEC-1989
	
	Files saved in the (default) Fast-Load-and-Save format of Microsoft
	QuickBASIC Version 4.50 cannot be used (are not downwards-compatible)
	with QuickBASIC Version 4.00 or 4.00b. The error message "bad file
	mode" indicates that the QuickBASIC Version 4.50 tokenized file is
	different than expected by Version 4.00 or 4.00b. You will need to
	first save QuickBASIC Version 4.50 files as text before loading them
	into QuickBASIC Version 4.00 or 4.00b.
	
	Fast-Load-format files saved by QuickBASIC Version 4.00 are generally
	upwardly compatible with Version 4.50, but it is recommended to always
	have a backup in ASCII text format for all files.
	
	Microsoft Product Support does not recommend using Fast-Load-and-Save
	format. Instead, always save with Text format, to avoid the chance of
	problems. To read about possible problems, query on QuickBASIC, your
	version number, and the following words:
	
	   fast and load and save and format
	
	Similarly, files saved in the (default) Fast-Load-and-Save format of
	QBX.EXE, which comes with BASIC PDS Version 7.00, cannot be used (are
	not downwards-compatible) with QuickBASIC Version 4.00, 4.00b or 4.50
	and will produce the "Bad File Mode" error message as well. QBX.EXE
	can, however, read files saved in the Fast-Load-format of Versions
	4.00, 4.00b and 4.50. As stated before, the Fast-Load-and-Save formats
	are upwardly compatible.
	
	The QuickBASIC Version 4.50 Help screens do not indicate that the Fast
	Load formats are different for the various versions of QuickBASIC.
	
	Note that QuickBASIC versions earlier than 4.00 do not have a Fast
	Load format (just text mode).
