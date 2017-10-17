---
layout: page
title: "Q61338: Docerr in MenuSet and MenuSetState in UI Toolbox of PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61338/
---

## Q61338: Docerr in MenuSet and MenuSetState in UI Toolbox of PDS 7.00

	Article: Q61338
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900412-65 docerr
	Last Modified: 8-JAN-1991
	
	Pages 546 and 547 of the "Microsoft BASIC 7.0: Language Reference" for
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 incorrectly state that the subroutine MenuSetState treats -1
	as a legal value for the parameter state%. The lowest legal value for
	state% is 0. This is the scope of the MenuSetState routine. The
	MenuSet subroutine should be called to remove an item from a menu.
	
	The MenuSet subroutine, on Pages 545 and 546 of the same manual, is
	also documented incorrectly because the lowest legal value of MenuSet
	is actually -1, not 0. To make a menu item or menu title disappear,
	you must call MenuSet with state% equal to -1.
