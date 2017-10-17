---
layout: page
title: "Q30285: C Extension to Make Psearch Prompt for an Input in M.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q30285/
---

## Q30285: C Extension to Make Psearch Prompt for an Input in M.EXE

	Article: Q30285
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 23-MAY-1988
	
	Question:
	   I wish to emulate the Brief Psearch (Plus Search) with the M.EXE
	editor. I want Psearch to prompt me to enter a search string. Can this
	be done with a macro or do I have to use a Microsoft C extension?
	
	Response:
	    This emulation cannot be done with macros. However, it can be done
	with Microsoft C extensions.
	    The following is an example of how to do so in a Microsoft C
	extension:
	
	    1. Use DoMessage() to output a string saying something similar to
	the following:
	
	    "Please enter the search string:"
	
	    2. Use KbUnHook() to disable M.EXE's "logical keyboard." This
	gives you the "focus" of the keyboard so that keyboard input is no
	longer read by the editor, thus freeing you to input a string from the
	user.
	    3. Parse the keyboard input and then process it appropriately by
	invoking the Psearch function.
	    4. Use KbHook() to reenable the logical keyboard in M.
	
	    The following is an alternate method:
	
	    Use "ReadChar()" instead of "KbUnHook()" and "KbHook()."
	(Mentioned in steps two and four above.)
	
	    For more information on the functions available for writing C
	extensions, please read the files EXT.DOC and EXT.H that are included
	with the Microsoft Editor Version 1.00.
	    For general information on programming C extensions, please
	consult Chapter 8 of the "Microsoft Editor User's Guide."
	    Appendix A of the "Microsoft Editor User's Guide" provides a
	comprehensive list of editing functions such as Psearch.
	    Psearch searches forward for the previously defined string or
	pattern. Msearch (Minus Search) searches backward for the previously
	defined string or pattern.
