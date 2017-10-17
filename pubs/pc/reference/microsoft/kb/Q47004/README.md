---
layout: page
title: "Q47004: Overlaying Charts and Displaying Multiple Charts on the Screen"
permalink: /pubs/pc/reference/microsoft/kb/Q47004/
---

## Q47004: Overlaying Charts and Displaying Multiple Charts on the Screen

	Article: Q47004
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm
	Last Modified: 18-AUG-1989
	
	It is not possible to overlay charts of the same size, as the charting
	routines clear the current viewport before drawing a chart. However,
	it is possible to display a small chart on top of a larger one, or to
	display charts side-by-side on the screen. The following programs
	demonstrate the steps necessary to size charts and display more than
	one chart at a time. PROG1.C overlays two small charts on top of a
	full-screen bar chart. PROG2.C displays four charts, one in each
	corner of the screen.
	
	The same technique can be used to place a chart onto an existing
	screen. Define the coordinates for the area in which you wish the
	chart to appear, and assign these coordinates to the "chartwindow"
	structure of the charting environment. Only this area is cleared when
	the chart is drawn.
	
	/* PROG1.C  ---------------------------------------------------------*/
	/* This program demonstrates overlaying charts. The initial chart    */
	/* drawn is a simple bar chart, which uses the entire screen. The    */
	/* second chart drawn is a column chart, which is displayed in a     */
	/* a viewport (x1=400, y1=50, x2=550, y2=175). This is displayed     */
	/* overlayed on the original bar chart. The third chart drawn is     */
	/* a pie chart, which is also drawn in a viewport (x1=350, y1=300,   */
	/* x2=525, y2=420), overlayed on the original barchart.              */
	
	#include <conio.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <string.h>
	#include <pgchart.h>
	
	#define COUNTRIES 5
	float far value[COUNTRIES] =    { 42.5, 14.3, 35.2, 21.3, 32.6    };
	char far *category[COUNTRIES] = { "A","B","C","D","E" };
	short far explode[COUNTRIES] =  { 0,1,0,1,0};
	
	void main(void)
	{
	    chartenv env;                       /* define chart environment */
	
	    _setvideomode(_VRES16COLOR);        /* set video mode...         */
	
	    _pg_initchart();                    /* Initialize chart system    */
	
	    /* Single-series bar chart. (full-screen) */
	    _pg_defaultchart( &env, _PG_BARCHART, _PG_PLAINBARS );
	    strcpy( env.maintitle.title, "Widget Production" );
	    _pg_chart( &env, category, value, COUNTRIES );
	
	    /* Single-series column chart. (viewport at upper right) */
	    _pg_defaultchart(&env, _PG_COLUMNCHART, _PG_PLAINBARS);
	    strcpy( env.maintitle.title, "Widget Production" );
	    env.chartwindow.x1 = 400;
	    env.chartwindow.y1 = 50;
	    env.chartwindow.x2 = 550;
	    env.chartwindow.y2 = 175;
	
	    _pg_chart( &env, category, value, COUNTRIES );
	
	    /* Pie chart. (viewport at lower right) */
	    _pg_defaultchart( &env, _PG_PIECHART, _PG_PERCENT );
	    strcpy( env.maintitle.title, "Widget Production" );
	    env.chartwindow.x1 = 350;
	    env.chartwindow.y1 = 300;
	    env.chartwindow.x2 = 525;
	    env.chartwindow.y2 = 420;
	
	    _pg_chartpie( &env, category, value, explode, COUNTRIES );
	    getch();
	
	    _setvideomode(_DEFAULTMODE);
	}
	
	/* PROG2.C  ---------------------------------------------------------*/
	/* This program demonstrates placing charts side-by-side on the      */
	/* screen. It displays four different charts, each taking up one     */
	/* quarter of the screen.                                            */
	
	#include <conio.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <string.h>
	#include <pgchart.h>
	
	#define COUNTRIES 5
	float far value[COUNTRIES] =    { 42.5, 14.3, 35.2, 21.3, 32.6    };
	float far axis2[COUNTRIES] =    { 1.0, 2.0, 3.0, 4.0, 5.0};
	char far *category[COUNTRIES] = { "A","B","C","D","E" };
	short far explode[COUNTRIES] =  { 0,1,0,1,0};
	
	void main(void)
	{
	    chartenv env;                       /* define chart environment */
	
	    _setvideomode(_ERESCOLOR);        /* set video mode...         */
	
	    _pg_initchart();                    /* Initialize chart system    */
	
	    /* Single-series bar chart. (viewport at upper left) */
	    _pg_defaultchart( &env, _PG_BARCHART, _PG_PLAINBARS );
	    strcpy( env.maintitle.title, "Widget Production" );
	    env.chartwindow.x1 = 0;
	    env.chartwindow.y1 = 0;
	    env.chartwindow.x2 = 320;
	    env.chartwindow.y2 = 175;
	
	    _pg_chart( &env, category, value, COUNTRIES );
	
	    /* Single-series column chart. (viewport at upper right) */
	    _pg_defaultchart(&env, _PG_COLUMNCHART, _PG_PLAINBARS);
	    strcpy( env.maintitle.title, "Widget Production" );
	    env.chartwindow.x1 = 320;
	    env.chartwindow.y1 = 0;
	    env.chartwindow.x2 = 639;
	    env.chartwindow.y2 = 175;
	
	    _pg_chart( &env, category, value, COUNTRIES );
	
	    /* Pie chart. (viewport at lower left) */
	    _pg_defaultchart( &env, _PG_PIECHART, _PG_PERCENT );
	    strcpy( env.maintitle.title, "Widget Production" );
	    env.chartwindow.x1 = 0;
	    env.chartwindow.y1 = 175;
	    env.chartwindow.x2 = 320;
	    env.chartwindow.y2 = 349;
	
	    _pg_chartpie( &env, category, value, explode, COUNTRIES );
	
	    /* Scatter chart. (viewport at lower right)   */
	    _pg_defaultchart(&env, _PG_SCATTERCHART, _PG_POINTONLY);
	    env.chartwindow.x1 = 320;
	    env.chartwindow.y1 = 175;
	    env.chartwindow.x2 = 639;
	    env.chartwindow.y2 = 349;
	    _pg_chartscatter(&env, (float far *)axis2, (float far *)value, 5);
	
	    getch();
	
	    _setvideomode(_DEFAULTMODE);
	}
