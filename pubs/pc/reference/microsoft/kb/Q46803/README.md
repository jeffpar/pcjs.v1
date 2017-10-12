---
layout: page
title: "Q46803: Presentation Graphics Allows Only One Color Per Data Series"
permalink: /pubs/pc/reference/microsoft/kb/Q46803/
---

	Article: Q46803
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-JUL-1989
	
	Question:
	
	Can the colors of individual bars (or columns) on a single-series bar
	(or column) chart be changed?
	
	Response:
	
	No; the only way to change colors is to change the color for the
	entire series, and therefore for all of the bars (or columns). This is
	done by modifying the "paletteentry" structure, which is assigned to
	the series. The paletteentry structure is defined as follows:
	
	typedef struct
	{
	    unsigned short          color;
	    unsigned short          style;
	    fillmap                 fill;
	    char                    plotchar;
	} paletteentry;
	
	An array of paletteentry types is predefined as
	
	   typedef paletteentry palettetype[_PG_PALETTELEN];
	
	where _PG_PALETTELEN is the number of series defined.
	
	When using a single-series chart, only palettetype[0] is defined,
	giving you the ability to assign one color, one style, one fillmask,
	and one plot character to the series. This is by design and
	cannot be changed.
