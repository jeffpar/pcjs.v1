---
layout: page
title: "Q68745: PGCHART: How to Draw a Line Chart with Lines Only"
permalink: /pubs/pc/reference/microsoft/kb/Q68745/
---

## Q68745: PGCHART: How to Draw a Line Chart with Lines Only

	Article: Q68745
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 29-JAN-1991
	
	Using _pg_defaultchart, you can specify a line-chart type with
	_PG_LINECHART. The choices for the chart style are _PG_POINTANDLINE
	and _PG_POINTONLY. There is no manifest constant for "lines only," but
	a line chart with lines only can be made with a few modifications to
	the existing code, which produces a chart with points and lines.
	
	The following code, which defines the field in the palette to be
	modified, is taken from page 259 of the "Microsoft C Advanced
	Programming Techniques" manual that shipped with C version 6.00.
	
	/* Typedef for pattern bitmap */
	typedef unsigned char fillmap[8];
	
	/* Typedef for palette entry definition */
	typedef struct
	{
	     unsigned short color;
	     unsigned short style;
	     fillmap fill;
	     char plotchar;     /* by default, the plotted character is '*' */
	}paletteentry;
	
	/* Typedef for palette definition */
	typedef paletteentry palettetype[ _PG_PALETTELEN ];
	
	The following are the modifications to be made to the sample program
	SCATTER.C, on pages 256-258 of "Microsoft C Advanced Programming
	Techniques" (also on pages 280-281 of "C For Yourself," which was
	shipped with QuickC version 2.50). Note that the original program
	produces a scatter chart; a line chart requires different arguments in
	the call to _pg_defaultchart(), as shown below.
	
	Declare the following variable
	
	   palettetype palette_struct;
	
	after the line
	
	   _pg_initchart( );
	
	but before the line
	
	   _pg_defaultchart( &env, _PG_LINECHART, _PG_POINTANDLINE);
	
	1. Get the array of current palette structures with the line:
	
	      _pg_getpalette( palette_struct );
	
	2. Change the plotted character in the first palette to a blank, so
	   that no points will appear on the graph (the line will be
	   unbroken). For example:
	
	      palette_struct[1].plotchar = ' ';
	
	3. Reset the palette with the line:
	
	      _pg_setpalette( palette_struct );
	
	The following is the modified SCATTER.C program:
	
	Sample Code
	-----------
	
	#include <conio.h>
	#include <string.h>
	#include <graph.h>
	#include <pgchart.h>
	
	#define MONTHS  12
	
	typedef enum {FALSE, TRUE}  boolean;
	
	float far value[MONTHS] =
	{
	        33.0,27.0,42.0,64.0,106.0,157.0,
	       182.0,217.0,128.0,62.0,43.0,36.0
	};
	
	char far *category[MONTHS] =
	{
	        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jly", "Aug",
	        "Sep", "Oct", "Nov", "Dec"
	};
	
	palettetype palette_struct;
	
	main( )
	{
	        chartenv env;
	        int mode = _VRES16COLOR;
	
	        if( _setvideomode( _MAXRESMODE ) == 0 )
	                exit( 0 );
	        _pg_initchart();
	
	        _pg_getpalette( palette_struct );
	        palette_struct[1].plotchar = ' ';
	        _pg_setpalette( palette_struct );
	
	        _pg_defaultchart( &env, _PG_LINECHART, _PG_POINTANDLINE );
	
	        strcpy( env.maintitle.title, "Good Neighbor Grocery" );
	        env.maintitle.titlecolor = 6;
	        env.maintitle.justify = _PG_RIGHT;
	        strcpy( env.subtitle.title, "Orange Juice vs Hot Chocolate" );
	        env.subtitle.titlecolor = 6;
	        env.subtitle.justify = _PG_RIGHT;
	        strcpy( env.xaxis.axistitle.title, "Months" );
	        strcpy( env.yaxis.axistitle.title, "Quantity" );
	        env.chartwindow.border = FALSE;
	        env.xaxis.ticinterval = 4.0;
	
	        if( _pg_chart( &env, category, value, MONTHS ) )
	        {
	                _setvideomode( _DEFAULTMODE );
	                _outtext( "Error: can't draw chart" );
	        }
	        else
	        {
	                getch();
	                _setvideomode( _DEFAULTMODE );
	        }
	        return( 0 );
	}
	
	For more information about line charts, see pages 252-273 of
	"Microsoft C Advanced Programming Techniques", and pages 267-296 of "C
	for Yourself."
