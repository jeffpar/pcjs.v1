---
layout: page
title: "Q35285: Monochrome Display Adapter Normal Text Example"
permalink: /pubs/pc/reference/microsoft/kb/Q35285/
---

## Q35285: Monochrome Display Adapter Normal Text Example

	Article: Q35285
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	On a monochrome display adapter, there is no way to display colors.
	However, you can display Normal Text, Bright Text, Reverse Video,
	Underline, and Blinking.
	
	The following program shows how to get Normal Text, No Blinking, No
	Underlining, and No Inverse on a monochrome display adapter:
	
	#include<graph.h>
	int     oldcolor;
	long    oldbkcolor;
	
	main()
	{
	 _clearscreen(_GCLEARSCREEN);
	 oldcolor=_gettextcolor();
	 oldbkcolor=_getbkcolor();
	 _settextposition(12,0);
	 _settextcolor(2);            /* foreground color Green */
	 _setbkcolor(0L);             /* background color Black */
	 _outtext("Normal Text, on Mono\n");
	 _settextcolor(oldcolor);
	 _setbkcolor(oldbkcolor);
	}
