---
layout: page
title: "Q47451: Black and White Text Modes Display in Color on Color System"
permalink: /pubs/pc/reference/microsoft/kb/Q47451/
---

	Article: Q47451
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_C docerr
	Last Modified: 22-DEC-1989
	
	Question :
	
	The characteristics of the different video modes that you can obtain
	with _setvidemode are listed in "C for Yourself" on Page 201. The two
	black and white text modes, _TEXTBW40 and _TEXTBW80, both show 16 gray
	shades as the available colors. When I set either of these modes, my
	text is output in color rather than in gray shades. Why can't I get
	gray tones?
	
	Response :
	
	The information in "C for Yourself" is accurate, but incomplete. The
	chart under _setvideomode in the QuickC on-line help is more
	informative. "C for Yourself" fails to explain that these modes do
	provide 16 colors, unless you are using a monochrome display, in which
	case you get 16 gray shades.
	
	The "C 5.1 Run-time Library Reference" and the QuickC on-line help for
	_setvideomode both list the black and white text modes as follows:
	
	   Mode                Type      Size      Colors    Adapter
	   ----                ----      ----      ------    -------
	
	   _TEXTBW40           M/T       40x25     16        CGA
	   _TEXTBW80           M/T       80x25     16        CGA
	
	This table is followed by the footnote:
	
	"For monochrome displays the number of colors is the number of gray
	shades".
