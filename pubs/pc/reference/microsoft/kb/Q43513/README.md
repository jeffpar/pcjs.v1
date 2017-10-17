---
layout: page
title: "Q43513: Assert Macro Causes Warning C4074 with /W3 in QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q43513/
---

## Q43513: Assert Macro Causes Warning C4074 with /W3 in QuickC 2.00

	Article: Q43513
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_c
	Last Modified: 2-MAY-1989
	
	When compiled at warning level three, both QuickC Version 2.00 and C
	Version 5.10 will produce the following warning when the assert macro
	provided with QuickC 2.00 is used (the assert macro from C 5.10 does
	not cause the error):
	
	   C4074: non standard extension used - 'function given file scope'
	
	The warning is due to a function, _assert, being prototyped within a
	statement block in the macro. A simplified example of this is shown
	below. The problem is caused by the first line after the opening
	brace. A function is defaulting to local scope when it needs a scope
	of file or global. The following is an example:
	
	    #define assert(exp)                         \
	    {                                           \
	        void _assert( char *, char *, int );    \
	        _assert( #exp, __FILE__, __LINE__ );    \
	    }
	
	A simple modification can be made to ASSERT.H from QuickC 2.00 to
	avoid this warning. There are two lines that must be deleted from the
	include file and one line that needs to be added. Lines 33 and 45
	should be removed and one of them should then be inserted, excluding
	the trailing slash, at line 28, between the "#else" and "#ifdef _QC".
	The line that will be deleted and moved is as follows:
	
	    void _CDECL _assert(void *, void *, unsigned); \
