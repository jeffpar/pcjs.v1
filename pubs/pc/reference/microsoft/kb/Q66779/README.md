---
layout: page
title: "Q66779: PG Chart Displays May Have Uneven Spacing Between Bars"
permalink: /pubs/pc/reference/microsoft/kb/Q66779/
---

	Article: Q66779
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 14-JAN-1991
	
	If a large number of bars or pie slices are displayed in a
	Presentation Graphics chart, the spacing between the bars or pie
	slices may be inconsistent. In most situations, any variation between
	the sizes of bar separations is minimal and generally unnoticeable.
	The sample program below demonstrates this problem on a bar, column,
	and pie chart.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
	
	Sample Code
	-----------
	
	#include <conio.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <string.h>
	#include <pgchart.h>
	
	#define COUNTRIES 25
	
	float _far value[COUNTRIES] = { 18.9F,  7.7F, 42.5F, 14.3F, 35.2F,
	                                21.3F, 42.5F, 14.3F, 35.2F, 21.3F,
	                                42.5F, 14.3F, 35.2F, 21.3F, 32.6F,
	                                42.5F, 14.3F, 35.2F, 21.3F, 32.6F,
	                                42.5F, 14.3F, 35.2F, 21.3F, 32.6F };
	char _far *category[COUNTRIES] = { "AB","YZ","UR","GD","USA","UK",
	                                   "UR","GD","USA","UK","UR","GD",
	                                   "USA","UK","Other","UR","GD",
	                                   "USA","UK","Other","UR","GD",
	                                   "USA","UK","Other" };
	short _far explode[COUNTRIES] = { 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
	                                  1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1,
	                                  1, 1, 1 };
	
	void main(void)
	{
	   chartenv env;
	
	   if( !_setvideomode( _MAXRESMODE ) )
	           exit( 1 );
	
	   _pg_initchart();              // Initialize chart system
	
	   // Single-series bar chart
	
	   _pg_defaultchart( &env, _PG_BARCHART, _PG_PLAINBARS );
	   strcpy( env.maintitle.title, "Widget Production" );
	   _pg_chart( &env, category, value, COUNTRIES );
	   getch();
	   _clearscreen( _GCLEARSCREEN );
	
	   // Single-series column chart
	
	   _pg_defaultchart( &env, _PG_COLUMNCHART, _PG_PLAINBARS );
	   strcpy( env.maintitle.title, "Widget Production" );
	   _pg_chart( &env, category, value, COUNTRIES );
	   getch();
	   _clearscreen( _GCLEARSCREEN );
	
	   // Pie chart
	
	   _pg_defaultchart( &env, _PG_PIECHART, _PG_PERCENT );
	   strcpy( env.maintitle.title, "Widget Production" );
	   _pg_chartpie( &env, category, value, explode, COUNTRIES );
	   getch();
	
	   _setvideomode( _DEFAULTMODE );
	}
