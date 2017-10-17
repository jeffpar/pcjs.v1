---
layout: page
title: "Q63661: Problems Viewing README.DOC Inside PWB Online Help and QH"
permalink: /pubs/pc/reference/microsoft/kb/Q63661/
---

## Q63661: Problems Viewing README.DOC Inside PWB Online Help and QH

	Article: Q63661
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER  |
	Last Modified: 15-AUG-1990
	
	Problems can occur when attempting to access the README.DOC from
	within the DOS versions of Programmer's WorkBench (PWB) or QH via the
	online help.
	
	When attempting to view the README.DOC file using the online help
	inside the DOS version of PWB, the messages "Error displaying help"
	and then "Cannot process cross reference" may be displayed in
	successive dialog boxes.
	
	When attempting to view the README.DOC file from within QH, the
	message "The database README.DOC is not open, or the topic is not
	found" may be displayed.
	
	Again, these problems are found only in the DOS version of PWB and QH.
	Access of the README.DOC in this manner does not produce errors under
	the OS/2 versions of PWB or QH.
	
	The following are two possible workarounds for the problem in PWB:
	
	1. The README.DOC can be loaded into the help system by typing the
	   following
	
	      arg "$PATH:readme.doc!" arg pwbhelp
	
	   with default keys:
	
	      Alt+A $PATH:readme.doc! F1
	
	   Note that this method may fail if there is another file named
	   README.DOC in the path before the C 6.00 README.DOC. If this is the
	   case, the other README.DOC will be loaded instead of the C 6.00
	   README.DOC. This method can also fail if there is not enough memory
	   to load the file into the help system.
	
	2. If the previous method fails, the C 6.00 README.DOC can be loaded
	   into PWB as a normal text file via the File.Open menu option. The
	   README.DOC can be found in the C 6.00 bound executable directory
	   (for example, C:\C600\BINB).
	
	The following are three possible workarounds for the problem in QH:
	
	1. Inside QH, select View.Search, type "$PATH:readme.doc!" and press
	   ENTER. Again, this will bring up the first README.DOC on the path.
	
	2. You can also select File.Open and load the the file by giving the
	   full path and filename of the C 6.00 README.DOC. QH allows you to
	   open any text file under 64K in size.
	
	3. To enable direct access of the README.DOC from within QH via the
	   README.DOC button, it is necessary to point the QH environment
	   variable to the directory where the README.DOC is located. For
	   example:
	
	      set qh=c:\c600\binb\readme.doc
	
	   The QH environment variable is not documented in the C 6.00 printed
	   or online documentation.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
