---
layout: page
title: "Q64786: _pg_chartpie() Fails to Free Memory in QC 2.00 and QC 2.50"
permalink: /pubs/pc/reference/microsoft/kb/Q64786/
---

	Article: Q64786
	Product: Microsoft C
	Version(s): 2.00 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.50
	Last Modified: 17-DEC-1990
	
	The presentation graphics function _pg_chartpie() fails to return
	memory allocated from DOS.
	
	Successive calls to _pg_chartpie() will cause three paragraphs of
	memory to be allocated from DOS for each call. Because there is no
	companion to _pg_initchart() [for example, _pg_closechart()], the
	memory allocated by _pg_chartpie() is not returned to DOS until the
	program finishes execution.
	
	The program below demonstrates this problem.
	
	Sample Code
	-----------
	
	#include <stdlib.h>
	#include <graph.h>
	#include <pgchart.h>
	#include <stdio.h>
	
	#define COUNTRIES 5
	float _far value[COUNTRIES] = { 42.5F,  14.3F, 35.2F,  21.3F,
	                                32.6F   };
	char  _far *category[COUNTRIES] = { "USSR", "GDR", "USA",  "UK",
	                                    "Other" };
	short _far explode[COUNTRIES] =   { 0,      1,     0,      1,     0 };
	
	void main()
	{
	    char stringbuff[80];
	    chartenv env;
	    unsigned sized=0;
	    unsigned seg=0;
	    /* Get Dos Memory Available on far heap-wait for key hit */
	    _settextposition(4,4);
	    _dos_allocmem(0xffff,&seg);
	    sprintf(stringbuff,"Memory : %u\n",seg);
	    _outtext(stringbuff);
	
	    getch();
	    if( !_setvideomode( _VRES16COLOR ) )
	        exit( 1 );
	
	    _pg_initchart(); /* Initialize chart system    */
	
	    while(1)
	        {
	
	    /* Pie chart */
	
	        _pg_defaultchart( &env, _PG_PIECHART, _PG_PERCENT );
	        strcpy( env.maintitle.title, "Widget Production" );
	        _pg_chartpie( &env, category, value, explode, COUNTRIES );
	
	    /* Display available memory- wait for key hit */
	
	        _settextposition(4,4);
	        _dos_allocmem(0xffff,&seg);
	        sprintf(stringbuff,"Memory : %u\n",seg);
	        _outtext(stringbuff);
	        getch();
	
	    }
	    _setvideomode( _DEFAULTMODE );
	}
	
	Microsoft has confirmed this to be a problem in QuickC version 2.50.
	We are researching this problem and will post new information here as
	it becomes available.
