---
layout: page
title: "Q27804: The struct videoconfig Declaration"
permalink: /pubs/pc/reference/microsoft/kb/Q27804/
---

	Article: Q27804
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-SEP-1988
	
	Page 342 of the "Microsoft C Run-Time Library Reference" manual for
	Version 5.00 has an omission. The struct videoconfig declaration
	member list leaves out the following four lines: mode, adaptor,
	monitor, and memory.
	
	The following is the structure as shown in the manual (incorrect):
	
	struct videoconfig {
	  short numxpixels;   /* number of pixels on X axis */
	  short numypixels;   /* number of pixels on Y axis */
	  short numtextcols;  /* number of text columns available */
	  short numtextrows;  /* number of text rows available */
	  short numcolors;    /* number of actual colors */
	  short bitsperpixel; /* number of bits per pixel */
	  short numvideopages;/* number of available video pages */
	}
	
	The following is the structure as defined in GRAPH.H (correct):
	
	struct videoconfig {
	  short numxpixels;   /* number of pixels on X axis */
	  short numypixels;   /* number of pixels on Y axis */
	  short numtextcols;  /* number of text columns available */
	  short numtextrows;  /* number of text rows available */
	  short numcolors;    /* number of actual colors */
	  short bitsperpixel; /* number of bits per pixel */
	  short numvideopages;/* number of available video pages */
	  short mode;         /* current video mode */
	  short adapter;      /* active display adapter */
	  short monitor;      /* active display monitor */
	  short memory;       /* adapter video memory in K bytes */
	}
