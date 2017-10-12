---
layout: page
title: "Q44260: Presentation Graphics Does Not Support 3-Dimensional Charts"
permalink: /pubs/pc/reference/microsoft/kb/Q44260/
---

	Article: Q44260
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-MAY-1989
	
	Microsoft QuickC Version 2.00 does not support three-dimensional
	charts with the Presentation Graphics package. The on-line help
	incorrectly states that the pie-chart Style 2 is a three-dimensional
	chart. The Feature Comparison data sheet available from the Microsoft
	Sales line, (800) 426-9400, prior to May 1989, also incorrectly states
	that the Presentation Graphics package supports three-dimensional
	charts.
	
	The reference to three-dimensional charts can be found on Page 149 of
	the "Microsoft Graphics Library Reference" manual. It can also be
	found by invoking on-line help on _pg_defaultchart and bringing up the
	description.
	
	When the following program is compiled, linked, and run, it is easy to
	see that both of the pie-chart styles are identical:
	
	#include <conio.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <string.h>
	#include <pgchart.h>
	
	#define COUNTRIES 5
	float far value[COUNTRIES] =    { 42.5,    14.3,    35.2,   21.3,  32.6    };
	char far *category[COUNTRIES] = { "USSR",  "France","USA",  "UK",  "Other" };
	short far explode[COUNTRIES] =  { 1,       1,       1,      0,     0       };
	
	main()
	{
	   chartenv env;
	   _setvideomode( _VRES16COLOR );               /* VGA graphics mode       */
	
	   _pg_initchart();                             /* Initialize chart system */
	
	   _pg_defaultchart( &env, _PG_PIECHART, 1 );   /* pie chart style 1       */
	   strcpy( env.maintitle.title, "Widget Production" );
	   _pg_chartpie( &env, category, value, explode, COUNTRIES );
	   getch();
	
	   _pg_defaultchart( &env, _PG_PIECHART, 2 );   /* pie chart style 2       */
	   strcpy( env.maintitle.title, "Widget Production" );
	   _pg_chartpie( &env, category, value, explode, COUNTRIES );
	   getch();
	
	   _setvideomode( _DEFAULTMODE );
	}
