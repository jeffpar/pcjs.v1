---
layout: page
title: "Q35289: MDA Blinking Bright Text Example"
permalink: /pubs/pc/reference/microsoft/kb/Q35289/
---

## Q35289: MDA Blinking Bright Text Example

	Article: Q35289
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	On a monochrome display adapter, there is no way to display colors.
	However, you can display Normal Text, Bright Text, Reverse Video,
	Underline, and Blinking.
	
	The following program shows how to get Bright Text, Blinking, No
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
	 _settextcolor(26);       /* foreground color Intense Green + 16 */
	 _setbkcolor(0L);         /* background color Black */
	 _outtext("Blinking Bright Text, on Mono\n");
	 _settextcolor(oldcolor);
	 _setbkcolor(oldbkcolor);
	}
