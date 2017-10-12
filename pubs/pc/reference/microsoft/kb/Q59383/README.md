---
layout: page
title: "Q59383: _setcliprgn Bad Definition in QC Graphics Library Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q59383/
---

	Article: Q59383
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 14-MAR-1990
	
	In the "Microsoft QuickC Graphics Library Reference" the _setcliprgn
	function on Page 181 is defined as follows:
	
	     void far _setcliprgn(x1,y1,x2,x2);
	     short x1,y1;
	     short x2,y2;
	
	It should be as follows:
	
	     void far _setcliprgn(x1,y1,x2,y2);
	
	Note that the last parameter is different.
