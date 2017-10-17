---
layout: page
title: "Q41477: QuickC 2.00 README.DOC: Using Another Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q41477/
---

## Q41477: QuickC 2.00 README.DOC: Using Another Editor

	Article: Q41477
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 1, "Notes on 'Up and Running.'" The notes refer
	to specific pages in "Up and Running."
	
	Page 32  Using Another Editor
	
	The instructions for using another editor are not complete. You can
	add any other editor to the menu. To use "Brief(R)," "Epsilon(TM)," or
	the Microsoft "M" Editor, follow these steps:
	
	Open the Utility menu and choose Customize Menu. Highlight "Custom&
	Editor" and choose the <Edit> button. In the text box for Path Name,
	list the path and the name of the editor. For example, \BIN\B,
	extension. Next, follow the appropriate steps below:
	
	Brief
	
	1. Set the Arguments command line to:
	    -m"editat $LINE $COL" $FILE
	
	2. Add the macro below to your Brief macro file:
	
	     ; *** editat -- interface to QC Utility.Edit menu
	     ; SYNOPSIS
	     ; b -m"editat $LINE $COL" $FILE
	     ; DESCRIPTION
	     ; editat positions Brief at the specified line and column in the
	     ; current file. It is invoked from the command line (i.e. -m )
	     ; *
	        (macro editat
	         (
	           (int line col)
	
	           (get_parm 0 line)
	           (get_parm 1 col)
	           (move_abs line col)
	         )
	       )
	
	Epsilon
	
	Set the Arguments command line to:
	
	     $FILE +$LINE
	
	M Editor
	
	Set the Arguments command line to:
	
	   /e "Arg \"$LINE\" Mark" $FILE
