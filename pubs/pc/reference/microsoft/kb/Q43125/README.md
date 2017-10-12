---
layout: page
title: "Q43125: Select Whole Word Search to Find Linker Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q43125/
---

	Article: Q43125
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	QuickC Version 2.00 locates linker errors in a C source file. Because
	the linker passes identifiers (not line numbers) back to QuickC,
	QuickC performs a text search on the identifier. This technique is not
	foolproof. For example, QuickC may point the cursor inside a comment
	if it finds a matching identifier there. Bypass this occurrence of the
	identifier by pressing F3 to search for the next occurrence.
	
	QuickC uses the same search flags that you defined through the search
	menu. When the "Whole Word" option is not selected (off is the
	default), you may receive superfluous information.
	
	For example, in the following program, the identifier '_outtext' would
	be highlighted as an unresolved external. The real culprit is
	'outtext'. To produce the expected results, do the following:
	
	1. Select the Search menu.
	
	2. Select the Find option from the Search menu.
	
	3. Select the "Whole Word" option and recompile. The "Whole Word"
	   option remains in effect until you exit from QuickC.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
	
	The following example demonstrates searching with "Whole Word" off:
	
	/* Press F3 to bypass this occurrence of 'outtext'. */
	
	#include <graph.h>
	
	void main (void)
	 {
	   /* Select "Whole Word" search to bypass this. */
	   _outtext ("Wombat hats");
	
	   /* This is the only line we want to find.   */
	   outtext ("and widgets");
	 }
	
	Common linker errors that will exhibit these problems are:
	
	error L2029 : <name> : unresolved external
	error L2025 : <name> : symbol defined more than once
	error L2044 : <name> : symbol multiply defined, use /NOE
