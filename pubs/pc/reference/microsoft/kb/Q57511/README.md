---
layout: page
title: "Q57511: Cannot Move Upper Left Corner in PG Chart Scatter Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q57511/
---

## Q57511: Cannot Move Upper Left Corner in PG Chart Scatter Functions

	Article: Q57511
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm chart
	Last Modified: 17-JAN-1990
	
	By changing the defaults in the windowtype structure, you can
	customize charts for use in Presentation Graphics (PG) as described in
	"C for Yourself" on Pages 251-260. However, when changing the default
	values for x1 and y1 in the windowtype structure for use with the
	_pg_chartscatter or _pg_chartscatterms functions, the function will
	either ignore the change, or fail.
	
	By changing the value for x1 in the windowtype structure, you can set
	the location of the left edge of the window. By changing y1, you can
	change the location of the top edge of the window. If you change one
	and not the other, the change will be ignored. If you change both of
	them, the chart scatter functions will fail and return 107, which
	means "chart window is too small." The following program demonstrates
	the problem:
	
	Sample Program
	--------------
	
	/*
	 * This is part of the sample program, SCAT.C, from the online help
	 * of QuickC 2.00 and QuickC 2.01.
	 */
	
	#include <conio.h>
	#include <graph.h>
	#include <string.h>
	#include <stdlib.h>
	#include <pgchart.h>
	
	#define ITEMS  5
	#define SERIES 2
	
	float far employees[SERIES][ITEMS] = { { 235., 423., 596., 729., 963. },
	                                       { 285., 392., 634., 801., 895. } };
	float far profits[SERIES][ITEMS] =   { { 0.9,  2.3,  5.4,  8.0,  9.3  },
	                                       { 4.2,  3.4,  3.6,  2.9,  2.7  } };
	char far *companies[SERIES] = { "Goodstuff, Inc.", "Badjunk & Co." };
	
	void main(void)
	{
	    int x;       /* for return value from _pg_chartscatter() */
	    chartenv env;
	    short mode = _VRES16COLOR;
	
	    while( !_setvideomode( mode ) )     /* Find a valid graphics mode   */
	        mode--;
	    if (mode == _TEXTMONO )
	        exit( 1 );                      /* No graphics available     */
	
	    _pg_initchart();                    /* Initialize chart system   */
	
	    /* Single-series scatter chart */
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.maintitle.title, "Goodstuff, Inc." );
	    strcpy( env.xaxis.axistitle.title, "Employees" );
	    strcpy( env.yaxis.axistitle.title, "Profitability" );
	
	/*  Change the value for x1 and y1.  Note that if only one is changed, the
	    value will be ignored.  If both are changed, _pg_chartscatter will fail *
	
	    env.chartwindow.x1 = 1;  /* left */
	    env.chartwindow.y1 = 1;  /* top  */
	
	    x = _pg_chartscatter( &env, employees[0], profits[0], ITEMS );
	    if (x != 0)
	        printf("error! chartscatter returned %d\n",x);
	    getch();
	    _clearscreen( _GCLEARSCREEN );
	
	    exit( !_setvideomode( _DEFAULTMODE ) );
	}
