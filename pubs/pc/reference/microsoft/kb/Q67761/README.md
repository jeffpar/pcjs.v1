---
layout: page
title: "Q67761: GRAPHICS.LIB Cannot Be Used with Tiny Model"
permalink: /pubs/pc/reference/microsoft/kb/Q67761/
---

## Q67761: GRAPHICS.LIB Cannot Be Used with Tiny Model

	Article: Q67761
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 6-FEB-1991
	
	Programs written in the tiny model cannot use the graphics library
	supplied with Microsoft C versions 6.00 and 6.00a. The graphics
	routines are meant to be model-independent, so they are labeled as far
	procedures. The linker does not allow far references in a tiny model
	program and does not resolve the references to the graphics routines.
	
	The sample source code below demonstrates this problem. The program
	should be compiled with:
	
	   cl /AT foo.c graphics.lib
	
	For more information on building .COM files, query on the article
	titled "Use of _far Keyword in Tiny Programs."
	
	Sample Code
	-----------
	
	#include <graph.h>
	
	void main(void);
	
	void main()
	{
	   _setvideomode(_DEFAULTMODE);
	}
