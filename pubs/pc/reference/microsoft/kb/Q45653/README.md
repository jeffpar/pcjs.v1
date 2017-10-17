---
layout: page
title: "Q45653: Making Your Own Key File with the MKKEY.EXE Program"
permalink: /pubs/pc/reference/microsoft/kb/Q45653/
---

## Q45653: Making Your Own Key File with the MKKEY.EXE Program

	Article: Q45653
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	The following information is from the Version 2.00 "Microsoft QuickC
	Up And Running" manual, Page 31:
	
	   The MKKEY program allows you to make your own key file. You must
	   use three options: -c, -i, and -o. The first (-c) specifies the
	   type of conversion: ASCII to binary (ab) or binary to ASCII (ba).
	   The two others specify the input file (-i) and the output file
	   (-o).
	
	   To modify the default QC.KEY file, you must first convert it to an
	   editable ASCII file:
	
	      MKKEY -c ba -i QC.KEY -o MYEDITOR.TXT
	
	   You may use any other editor (including QuickC's) to edit the file
	   named MYEDITOR.TXT, which lists the keystrokes that perform certain
	   actions. For example, you press CTRL+G to delete a character. The
	   line in MYEDITOR.TXT looks like this:
	
	      Del: CTRL+G
	
	   You could change that command to any other keystroke (CTRL+D, say),
	   as long as the key isn't already assigned to another function.
	   Elsewhere in the file, CTRL+D is assigned to CharRight, so you'd
	   have to delete or change that line if you wanted to use CTRL+D for
	   the Del function.
	
	   When you're satisfied with the new functions, you must convert the
	   ASCII file to binary, so that it can be loaded into the QuickC editor:
	
	      MKKEY -c ab -i MYEDITOR.TXT -o MYEDITOR.KEY
	
	   Finally, to load the new key file, use the /k: option.
	
	The /k: option is used on the QuickC command line to specify a new
	.KEY file, as follows:
	
	   QC /k:myeditor.key <filename>
	
	The "Up and Running" appendix lists the editor functions by name and
	shows their default assignments in the supplied .KEY files. Any of
	these may be remapped using the MKKEY utility. Menu options, which have
	key equivalents, may not be remapped (e.g. Exit).
