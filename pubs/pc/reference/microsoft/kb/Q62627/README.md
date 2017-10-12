---
layout: page
title: "Q62627: M6101 on PG Scatter Charts with Autoscaling Off"
permalink: /pubs/pc/reference/microsoft/kb/Q62627/
---

	Article: Q62627
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc buglist6.00 buglist6.00a
	Last Modified: 21-JAN-1991
	
	If you turn autoscaling off in any Presentation Graphics scatter
	chart, you will receive a run-time error M6101 -- invalid math
	operation -- when the _pg_chartscatter() run-time function is called.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and buglist2.51).
	We are researching this problem and will post new information here as
	it becomes available.
	
	Sample Code
	-----------
	
	The following code is from the SCAT.C sample program, which is the
	sample program found in the online help for the _pg_chartscatter and
	_pg_chartscatterms routines. Note the added lines, which turn off
	autoscaling. Compile the program, then link with the GRAPHICS.LIB and
	PGCHART.LIB files. Running the application will duplicate the M6101
	run-time error.
	
	/* SCAT.C illustrates presentation graphics scatter chart functions
	 * including:
	 *    _pg_chartscatter   _pg_chartscatterms
	 */
	
	#include <conio.h>
	#include <graph.h>
	#include <string.h>
	#include <stdlib.h>
	#include <pgchart.h>
	
	#define ITEMS  5
	#define SERIES 2
	float _far people[SERIES][ITEMS]  = { { 235.F, 423.F, 596.F, 729.F,
	                                                  963.F },
	                             { 285.F, 392.F, 634.F, 801.F, 895.F }
	                                                                 };
	float _far profits[SERIES][ITEMS] = { { 0.9F,  2.3F,  5.4F,  8.0F,
	                                                             9.3F  },
	                               { 4.2F,  3.4F,  3.6F,  2.9F,  2.7F  }
	                                                                   };
	char  _far *companies[SERIES] = { "Goodstuff,Inc.", "Badjunk & Co." };
	
	void main()
	{
	        chartenv env;
	
	        if( !_setvideomode( _MAXRESMODE ) ) /* Find a valid graphics
	                                                               mode */
	                exit( 1 );
	        _pg_initchart();                 /* Initialize chart system */
	
	        /* Show single-series scatter chart. */
	        _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	        strcpy( env.maintitle.title, "Goodstuff, Inc." );
	        strcpy( env.xaxis.axistitle.title, "Employees" );
	        strcpy( env.yaxis.axistitle.title, "Profitability" );
	
	/****** Note : Turn one of these two to '0' or off, or uncomment
	        this section to cause problem.                          */
	
	/*        env.xaxis.autoscale=1;   */
	/*        env.yaxis.autoscale=0;   */
	
	/********************************************************************/
	
	        _pg_chartscatter( &env, people[0], profits[0], ITEMS );
	        getch();
	        _clearscreen( _GCLEARSCREEN );
	
	        /* Show multiseries scatter chart. */
	        _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	        strcpy( env.xaxis.axistitle.title, "Employees" );
	        strcpy( env.yaxis.axistitle.title, "Profitability" );
	        _pg_chartscatterms( &env, (float _far *)people,
	             (float _far *)profits, SERIES, ITEMS, ITEMS, companies );
	        getch();
	
	        _setvideomode( _DEFAULTMODE );
	}
