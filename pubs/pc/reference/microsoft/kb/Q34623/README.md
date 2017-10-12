---
layout: page
title: "Q34623: _remappalette(8,_GRAY) Does Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q34623/
---

	Article: Q34623
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | bug
	Last Modified: 12-OCT-1988
	
	_remappalette(pixel,color) maps the number "pixel" to the value
	"color" and is suppose to return the previous color value. However,
	when this function is invoked as _remappalette(8,_GRAY), the value
	associated with _WHITE is returned.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
	
	To demonstrate this problem, do the following:
	
	1. cl the following source-code chunklet with /Od /Zi
	   switches.
	
	2. Go into CodeView.
	
	3. Set N16 to look at the value err returned by _remappalette() in hex,
	   then compare the value with values for the colors in graph.h. You
	   may want to make a hardcopy of these values prior to cving. The
	   correct value is returned on the zeroth pass, but then erroneous
	   values are returned. This has been raided.
	
	4. Use cv /S, where the S is for switching screen modes.
	
	The following sample code demonstrates the problem:
	
	         #include <stdio.h>
	         #include <graph,h>
	         main()
	         {
	            int i;
	            long err;
	            _setvideomode(_HRES16COLOR);
	            for (i=0;i<16;i++)
	            {
	              err=_remappalette(8,_GRAY);
	              printf("%x\n",err);
	            }
	            _setvideomode(_DEFAULTMODE);
	         }
