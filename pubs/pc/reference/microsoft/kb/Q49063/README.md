---
layout: page
title: "Q49063: Changing Default Character in QC 2.00 Presentation Graphics"
permalink: /pubs/pc/reference/microsoft/kb/Q49063/
---

	Article: Q49063
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm
	Last Modified: 10-OCT-1989
	
	You can change the default characters used by QuickC Version 2.00's
	presentation graphics library routines to any other character. To
	change the default character, insert the following lines of code
	before you display the graphic:
	
	charmap  chartemp1;
	
	/* '*' is default character */
	/* change '*' to ASCII character '+' */
	
	_pg_getchardef ('+', chartemp1);
	_pg_setchardef ('*', chartemp1);
	
	The first line gets the new character that you want to use. The second
	line sets the new character to the character that you want to replace.
	
	You cannot display each point in a data series as a different
	character, but you can change the default characters for each data
	series.
	
	The following code is the _pg_chartscatter() example from the QuickC
	2.00 on-line help. The lines of code mentioned above have been added
	to the code example to demonstrate this feature.
	
	Code Example
	------------
	
	#include <conio.h>
	#include <graph.h>
	#include <string.h>
	#include <stdlib.h>
	#include <pgchart.h>
	
	#define ITEMS  5
	#define SERIES 2
	float far employees[SERIES][ITEMS] = { {235., 423., 596., 729., 963.},
	                                      {285., 392., 634., 801., 895.} };
	float far profits[SERIES][ITEMS] =   { {0.9,  2.3,  5.4,  8.0,  9.3},
	                                      {4.2,  3.4,  3.6,  2.9,  2.7} };
	char far *companies[SERIES] = { "Goodstuff, Inc.", "Badjunk & Co."};
	
	charmap  chartemp1;
	
	main()
	{
	    chartenv env;
	    short mode = _VRES16COLOR;
	
	    while( !_setvideomode( mode ) )
	        mode--;
	    if (mode == _TEXTMONO )
	        exit( 1 );
	
	    _pg_initchart();
	
	    /* Change '*' to '+' */
	
	    _pg_getchardef ('+', chartemp1);
	    _pg_setchardef ('*', chartemp1);
	
	    /* Single-series scatter chart */
	
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.maintitle.title, "Goodstuff, Inc." );
	    strcpy( env.xaxis.axistitle.title, "Employees" );
	    strcpy( env.yaxis.axistitle.title, "Profitability" );
	    _pg_chartscatter( &env, employees[0], profits[0], ITEMS );
	    getch();
	    _clearscreen( _GCLEARSCREEN );
	
	    /* Multi-series scatter chart */
	
	    _pg_defaultchart (&env, _PG_SCATTERCHART, _PG_POINTONLY );
	    strcpy( env.xaxis.axistitle.title, "Employees" );
	    strcpy( env.yaxis.axistitle.title, "Profitability" );
	    _pg_chartscatterms( &env, (float far *)employees,
	                        (float far *)profits, SERIES, ITEMS, ITEMS,
	                        companies );
	    getch();
	
	    exit( !_setvideomode( _DEFAULTMODE ) );
	}
