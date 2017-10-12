---
layout: page
title: "Q43914: C: Text Modes Don't Return Pixel Information"
permalink: /pubs/pc/reference/microsoft/kb/Q43914/
---

	Article: Q43914
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 11-JAN-1990
	
	After a call to _getvideoconfig () from text modes, the structure
	videoconfig contains zero (0) for numxpixels, numypixels, and
	bitsperpixel. This is expected behavior because only the graphics
	modes return pixel information.
	
	Both text and graphics modes return information about the number of
	text columns and rows.
	
	The following example demonstrates the absence of pixel information
	in text modes. The name of each text mode begins with "_TEXT."
	
	#include stdio.h
	#include graph.h
	
	struct videoconfig vc;  /* variable vc of type videoconfig */
	
	/* define an array of video modes and mode names
	   since the numbers are not continuous */
	
	int modes[12] = {_TEXTBW40, _TEXTC40, _TEXTBW80, _TEXTC80,
	    _MRES4COLOR, _MRESNOCOLOR, _HRESBW, _TEXTMONO,
	    _MRES16COLOR, _HRES16COLOR, _ERESNOCOLOR, _ERESCOLOR};
	
	char *modenames[] = {"TEXTBW40", "TEXTC40", "TEXTBW80",
	                      "TEXTC80", "MRES4COLOR", "MRESNOCOLOR",
	                      "HRESBW", "TEXTMONO", "MRES16COLOR",
	                      "HRES16COLOR", "ERESNOCOLOR", "ERESCOLOR"};s0
	main()
	{
	
	   int i;
	   /* test all video modes */
	   for (i=0; i<= 11; i++) {
	       _setvideomode (modes[i]);
	       _getvideoconfig (&vc);
	       printf ("\n video mode: \t%s\n",modenames[i]);
	       printf (" x pixels: \t%d\n",vc.numxpixels);
	       printf (" y pixels: \t%d\n",vc.numypixels);
	       printf (" text columns: \t%d\n",vc.numtextcols);
	       printf (" text rows: \t%d\n",vc.numtextrows);
	       printf (" # of colors: \t%d\n",vc.numcolors);
	       printf (" bits/pixel: \t%d\n",vc.bitsperpixel);
	       printf (" video pages: \t%d\n",vc.numvideopages);
	       printf (" Hit return for next video mode");
	       getchar();
	       _clearscreen (_GCLEARSCREEN);
	   }
	   _setvideomode (_DEFAULTMODE);
	}
	
	The definition of structure videoconfig and the arguments to
	_setvideomode() are contained in the include file graph.h. The
	arguments for _setvideomode() are also present on Page 539 of the
	"Microsoft C for the MS-DOS Operating System: Run-Time Library
	Reference."
