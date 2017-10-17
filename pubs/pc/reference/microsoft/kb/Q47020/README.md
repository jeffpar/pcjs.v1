---
layout: page
title: "Q47020: Don't Use #line While Debugging in QuickC or Using CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q47020/
---

## Q47020: Don't Use #line While Debugging in QuickC or Using CodeView

	Article: Q47020
	Version(s): 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_CodeView
	Last Modified: 11-OCT-1989
	
	Do not use the #line directive when using the debug facility under
	QuickC or while using CodeView.
	
	The #line directive tells the preprocessor to change the compiler's
	internally stored line number and filename to a given line number and
	filename. The compiler uses the line number and filename to refer to
	errors that it finds during compilation. The line number normally
	refers to the current input line, and the filename refers to the
	current input file. The line number is incremented after each line is
	processed.
	
	If you change the line number, the compiler ignores the previous
	values and continues processing with the new values. Therefore, if you
	debug or use CodeView, the trace does not match up to your source
	code.
