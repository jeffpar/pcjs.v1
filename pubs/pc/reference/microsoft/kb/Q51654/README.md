---
layout: page
title: "Q51654: Use _pg_setpalette() to Modify the Plot Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q51654/
---

	Article: Q51654
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | presentation graphics pgchart
	Last Modified: 17-JAN-1990
	
	To modify the default character used for plotting line and scatter
	charts, use the _pg_getpalette() and _pg_setpalette() functions. These
	functions expect a variable of type palettetype, which is an array of
	structures (defined in pgchart.h). Palettes are discussed in Section
	3.4 of the "Microsoft QuickC Graphics Library Reference" manual for
	Version 2.00. Below is an an example of how to use _pg_setpalette to
	modify the default plot character for single and multiseries charts.
	
	/* PLOTCHAR.C - Modifies the default plotting characters.      */
	/* Note: To modify the array, start with index 1 -- see below. */
	
	#include <conio.h>
	#include <graph.h>
	#include <string.h>
	#include <stdlib.h>
	#include <pgchart.h>
	
	#define ITEMS  5
	#define SERIES 2
	float far employees[SERIES][ITEMS] = {{235.0F, 423.0F, 596.0F,
	                                       729.0F, 963.0F},
	                                      {285.0F, 392.0F, 634.0F,
	                                       801.0F, 895.0F}};
	
	float far profits[SERIES][ITEMS] =   {{0.9F,  2.3F,  5.4F,
	                                       8.0F,  9.3F},
	                                      {4.2F,  3.4F,  3.6F,
	                                       2.9F,  2.7F}};
	
	char far *companies[SERIES] = { "Goodstuff, Inc.", "Badjunk & Co."};
	
	/* This type is defined in pgchart.h */
	palettetype pal ;
	
	void main( void )
	{
	    chartenv env;
	    short mode = _VRES16COLOR;
	
	    while( !_setvideomode( mode ) )
	        mode--;
	    if (mode == _TEXTMONO )
	        exit( 1 );
	
	    _pg_initchart();
	
	    /* Single-series scatter chart */
	
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.maintitle.title, "Goodstuff, Inc." );
	    strcpy( env.xaxis.axistitle.title, "Employees" );
	    strcpy( env.yaxis.axistitle.title, "Profitability" );
	
	    /* Get old palette and modify plotchar for first series */
	    _pg_getpalette( pal ) ;
	    pal[1].plotchar = '+' ;
	    _pg_setpalette( pal ) ;
	
	    _pg_chartscatter( &env, employees[0], profits[0], ITEMS );
	    getch();
	    _clearscreen( _GCLEARSCREEN );
	
	    /* Multi-series scatter chart */
	
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.xaxis.axistitle.title, "Employees" );
	    strcpy( env.yaxis.axistitle.title, "Profitability" );
	
	    /* Get old palette and modify plotchar for second series */
	    _pg_getpalette( pal ) ;
	    pal[2].plotchar = 'X' ;
	    _pg_setpalette( pal ) ;
	    _pg_chartscatterms( &env, (float far *)employees,
	                        (float far *)profits, SERIES, ITEMS, ITEMS,
	                        companies );
	    getch();
	
	    exit( !_setvideomode( _DEFAULTMODE ) );
	}
