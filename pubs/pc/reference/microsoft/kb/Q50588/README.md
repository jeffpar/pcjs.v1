---
layout: page
title: "Q50588: Controlling the Use of Tabs in the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q50588/
---

	Article: Q50588
	Product: Microsoft C
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	The Microsoft Editor (M) provides the following two ways of using tab
	characters:
	
	1. Treat tabs as real characters.
	
	2. Convert each tab into a series of spaces. This is controlled
	through the use of the "realtabs" switch. Other switches may also
	effect the way tabs appear to be handled by the editor.
	
	The following chart, taken from Section 7.2.6 of "Microsoft Editor for
	MS OS/2 and MS-DOS User's Guide" describes the switches dealing with
	tabs.
	
	1. realtabs
	
	   On by default, controls whether or not tabs are treated as real tab
	   characters.
	
	2. entab
	
	   Controls the extent to which the editor converts a series of tabs
	   and spaces to tabs when saving a file. The following are the valid
	   choices:
	
	      0 - The editor does not replace spaces by tabs. If realtabs is off,
	          tabs are converted to spaces.
	
	      1 - (default) The editor can replace a series of tabs and spaces by
	          tabs when the tabs fall outside of quoted strings.
	
	      2 - The editor will replace all series of tabs and spaces with
	          tabs.
	
	   Note: The entab switch only effects the lines you modify during the
	   current editing session.
	
	3. filetab
	
	   Controls the meaning of tab characters on a disk file. If realtabs
	   is on, the filetab switch determines tab alignment. If realtabs is
	   off, the filetab switch determines how the editor translates tab
	   characters to spaces when a line of text is modified.
	
	   If entab, as described above, is set to 1 or 2, filetab also
	   determines how the editor translates spaces to tabs when you save
	   the file to disk.
	
	   Note: The filetab switch only effects the lines you modify during
	   the current editing session.
	
	4. tabalign
	
	   When off (the default), the cursor may be placed anywhere inside a
	   column of a tab character. If turned on, along with realtabs, the
	   cursor is placed to the first column position of tab characters.
	
	5. tabstops
	
	   Determines the size of columns associated with the TAB and BACKTAB
	   ( SHIFT+TAB) keys. This only moves the cursor and has no effect on
	   the actual tab character. The default value is 4.
	
	   The following example sets up tabs so that they act the same way
	   they do in other editors, such as QuickC or Word:
	
	      realtabs:yes
	      tabalign:yes
	      graphic:tab
	      trailspace:yes
	      filetab:4
	
	The trailspace switch is needed to use tabs on blank lines. The
	tabdisp switch may also be used with realtabs to make the tab
	characters visible on the screen.
