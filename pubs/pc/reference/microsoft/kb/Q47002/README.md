---
layout: page
title: "Q47002: How to Change the Size of a Presentation Graphics Chart"
permalink: /pubs/pc/reference/microsoft/kb/Q47002/
---

## Q47002: How to Change the Size of a Presentation Graphics Chart

	Article: Q47002
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm
	Last Modified: 18-AUG-1989
	
	Question:
	
	How can the size of a chart be changed so that you can use part of the
	screen to output explanatory text?
	
	Response:
	
	This capability is built into the charting environment. The chartenv
	structure is defined as follows:
	
	           typedef struct {
	             short          charttype;
	                                /* _PG_BAR, _PG_COLUMN, _PG_LINE, etc.*/
	             short          chartstyle;
	                                /* style for selected chart type      */
	             windowtype     chartwindow;
	                                /* SIZE OF WINDOW FOR CHART!!!!!      */
	             windowtype     datawindow;
	                                /* size of window for chart data      */
	             titletype      maintitle; /* main chart title            */
	             titletype      subtitle;  /* chart sub-title             */
	             axistype       xaxis;
	                                /* structure for customizing x-axis   */
	             axistype       yaxis;
	                                /* structure for customizing y-axis   */
	             } chartenv;
	
	The size can be changed by modifying the elements of the "chartwindow"
	element of the "chartenv" structure. The "chartwindow" element is of
	"windowtype", which is defined as follows:
	
	            typedef struct {
	               short  x1;        /* left edge of window in pixels     */
	               short  y1;        /* top edge of window in pixels      */
	               short  x2;        /* right edge of window in pixels    */
	               short  y2;        /* bottom edge of window in pixels   */
	               short  border;    /* TRUE=border, FALSE=no border      */
	               short  background;/* palette color for window bkground */
	               short  borderstyle; /* style bytes for window border   */
	               short  bordercolor; /* palette color for window border */
	               } windowtype;
	
	Therefore, if the program has defined a variable "env" of "chartenv"
	type, the chart can be sized by changing env.chartwindow.x1,
	env.chartwindow.y1, env.chartwindow.x2, and env.chartwindow.y2. The
	following program demonstrates making these changes to a simple bar
	chart:
	
	/*-------------------------------------------------------------------*/
	/* MINIBAR.C: This program demonstrates sizing the entire chart so   */
	/* that it will fit in the upper-left quarter of the screen, leaving */
	/* the remainder of the screen available for other uses. The chart   */
	/* is a simple default bar chart, but the principle is the same,     */
	/* regardless of chart type.                                         */
	
	#include <conio.h>
	#include <string.h>
	#include <graph.h>                 /* required include files */
	#include <pgchart.h>
	
	#define MONTHS 12
	
	typedef enum {FALSE, TRUE} boolean;
	
	float far value [MONTHS] =          /*value (series) data array */
	{
	 (float)1.00, (float)2.00, (float)3.00, (float)4.00,
	 (float)5.00, (float)6.00,(float)7.00, (float)8.00,
	 (float)9.00, (float)10.00, (float)11.00, (float)12.00
	  };
	
	char far *category[MONTHS] =         /* category data array */
	  {
	  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jly", "Aug", "Sep", "Oct","Nov", "Dec"
	  };
	
	main()
	
	{
	chartenv env;                     /* define chart environment variable */
	
	_setvideomode(_ERESCOLOR);        /* set to graphics mode */
	
	/* initialize chart library and a default bar chart */
	_pg_initchart();
	
	_pg_defaultchart(&env, _PG_BARCHART, _PG_PLAINBARS);
	
	/* set the chart size to the upper left quarter of the screen   */
	
	env.chartwindow.x1 = 0;
	env.chartwindow.y1 = 0;
	env.chartwindow.x2 = 320;
	env.chartwindow.y2 = 175;
	
	if(_pg_chart (&env,category,value, MONTHS)) /* call to charting routine*/
	        {_setvideomode(_DEFAULTMODE);       /* error trap...*/
	         _outtext("error, can't draw chart");
	         }
	     else
	        {
	         getch();                          /* wait for a keystroke */
	         }
	        _setvideomode(_DEFAULTMODE);      /* reset the video mode  */
	
	         return(0);
	         }
