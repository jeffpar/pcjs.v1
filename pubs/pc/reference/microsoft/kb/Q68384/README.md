---
layout: page
title: "Q68384: First _pg_chartscatter() Call May Not Use Specified plotchar"
permalink: /pubs/pc/reference/microsoft/kb/Q68384/
---

	Article: Q68384
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc buglist6.00 buglist6.00a pgchart
	Last Modified: 24-JAN-1991
	
	When producing scatter charts with the Presentation Graphics function
	_pg_chartscatter(), the first scatter chart created in a program may
	be drawn with the default plotting character even if a different
	character was specified. This usually results from calling
	_pg_initchart() before setting the graphics video mode with
	_setvideomode().
	
	The problem stems from an initialization sequence for the palette that
	is used whenever a new video mode is set. If the call to _pg_initchart
	is made AFTER a call to _setvideomode(), then the palette should not
	be affected.
	
	The sample program below demonstrates this problem and the workaround.
	The program draws two scatter charts. For the first chart, the '$'
	character is specified for the plotting character. For the second
	chart, the '#' character is the plotting character. The second chart
	uses the '#' character as specified, but the first chart is drawn with
	the '*' character, which is the default plotting character.
	
	If the program is altered, so that the call to _pg_initchart is moved
	down a few lines to after the call to _setvideomode(), then the
	problem goes away and the first chart is drawn correctly with the '$'
	character.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
	
	Sample Code
	-----------
	
	/* TEST.C
	   Compile line: CL test.c graphics.lib pgchart.lib  */
	
	#include <conio.h>
	#include <graph.h>
	#include <string.h>
	#include <stdlib.h>
	#include <pgchart.h>
	
	float _far x[2][5] = { 23.0F, 42.0F, 59.0F, 72.0F, 96.0F };
	float _far y[2][5] = {  0.9F,  2.3F,  5.4F,  8.0F,  9.3F };
	
	void main(void)
	{
	    chartenv env;
	    palettetype pal;
	    int i;
	
	    /* Move the following line to after the call to _setvideomode() */
	    _pg_initchart();
	    if( !_setvideomode( _MAXRESMODE ) )
	        exit( 1 );
	
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.maintitle.title, "Scatter Test" );
	    strcpy( env.xaxis.axistitle.title, "X Amount" );
	    strcpy( env.yaxis.axistitle.title, "Y Amount" );
	
	    strcpy( env.subtitle.title, "\"plotchar\" should be '$'" );
	    _pg_getpalette(pal);
	    for(i=0; i < _PG_PALETTELEN; i++)
	        pal[i].plotchar = '$';
	    _pg_setpalette(pal);
	    _pg_chartscatter( &env, x[0], y[0], 5 );
	    getch();
	    _clearscreen( _GCLEARSCREEN );
	
	    strcpy( env.subtitle.title, "\"plotchar\" should be '#'" );
	    _pg_getpalette(pal);
	    for(i=0; i < _PG_PALETTELEN; i++)
	        pal[i].plotchar = '#';
	    _pg_setpalette(pal);
	    _pg_chartscatter( &env, x[0], y[0], 5 );
	    getch();
	    _clearscreen( _GCLEARSCREEN );
	
	    _setvideomode( _DEFAULTMODE );
	}
