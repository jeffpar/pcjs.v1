---
layout: page
title: "Q35286: MDA Bright Underlined Text Example"
permalink: /pubs/pc/reference/microsoft/kb/Q35286/
---

## Q35286: MDA Bright Underlined Text Example

	Article: Q35286
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	On a monochrome display adapter, there is no way to display colors.
	However, you can display Normal Text, Bright Text, Reverse Video,
	Underline, and Blinking.
	
	The following program shows how to get Bright Text, No Blinking,
	Underlined, and No Inverse on a monochrome display adapter:
	
	#include<graph.h>
	int     oldcolor;
	long    oldbkcolor;
	
	main()
	{
	 _clearscreen(_GCLEARSCREEN);
	 oldcolor=_gettextcolor();
	 oldbkcolor=_getbkcolor();
	 _settextposition(12,0);
	 _settextcolor(9);            /* foreground color Intence Blue */
	 _setbkcolor(0L);             /* background color Black */
	 _outtext("Bright Underlined Text, on Mono\n");
	 _settextcolor(oldcolor);
	 _setbkcolor(oldbkcolor);
	}
