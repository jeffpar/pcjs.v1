---
layout: page
title: "Q57937: _pg_chartpie Fails on { 1.0, 0.0 } Set Elements"
permalink: /pubs/pc/reference/microsoft/kb/Q57937/
---

## Q57937: _pg_chartpie Fails on { 1.0, 0.0 } Set Elements

	Article: Q57937
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01 100% 0%
	Last Modified: 20-FEB-1990
	
	Calling the Presentation Graphics function _pg_chartpie with a set of
	values that contain a 100-percent and one or more 0 (zero) percent
	elements fails to draw a full pie chart as expected but draws a
	diameter line from the center of the circle to the circumference.
	
	The following is a workaround:
	
	If your chart is being drawn in Hercules monographics mode,
	(_HERCMONO), you can give the illusion of having a full graph. Set the
	elements to { 1.0, 0.00113 } or { 100.0, 0.113 } to allow _pg_chartpie
	to draw a circle that appears to be full. If the smaller element is
	0.113 percent or more of the larger element, the chart will draw
	correctly.
	
	The same trick does not appear to work in other modes. _VRES16COLOR
	and _ERESCOLOR modes were tested and the full circle illusion could
	not be duplicated. In _VRES16COLOR mode, a line is drawn at sets with
	0.0795 and smaller second elements, and a broken circle is drawn in
	sets with 0.07975 or larger second elements. In _ERESCOLOR mode, a
	line is drawn for sets with 0.112 and smaller values for the second
	element. A broken circle is drawn for sets with 0.113 and larger
	second element values.
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
	
	The following code demonstrates this problem:
	
	#include <stdio.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <pgchart.h>
	#include <conio.h>
	#include <string.h>
	
	#define NUMVALS 2
	
	float far value[NUMVALS] = { 100.0f, 0.0f };
	/* float far value[NUMVALS] = { 100.0f, 0.113f } ;  this is the
	                                            fix in HERC mode */
	
	char far *category[NUMVALS] = { "First", "Second" };
	short far explode[NUMVALS] = { 0, 0 };
	
	void main(void)
	{
	      int returnval;
	      chartenv env;
	      if( (returnval = _setvideomode(_HERCMONO)) == 0)
	      {
	          printf("Video mode not supported.\n");
	          exit (-1);
	      }
	     _pg_initchart();
	     _pg_defaultchart( &env, _PG_PIECHART, 2);
	     _clearscreen(_GCLEARSCREEN);
	      strcpy(env.maintitle.title, "TEST TITLE");
	     _pg_chartpie(&env, category, value, explode, NUMVALS);
	      getch();
	     _setvideomode(_DEFAULTMODE);
	}
