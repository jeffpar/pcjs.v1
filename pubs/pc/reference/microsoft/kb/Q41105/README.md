---
layout: page
title: "Q41105: The Steps Required to Create a Chart in QuickC Version 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q41105/
---

	Article: Q41105
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	The following steps provide a guideline for creating a simple chart
	with QuickC Version 2.00:
	
	1. Include all necessary header files. These will include PGCHART.H,
	   GRAPH.H, and any other include files required by other routines in
	   your program.
	
	2. Assemble the chart data in arrays, one single-dimensioned
	   array per axis. (More for the value axis if creating a chart
	   of a type that supports multiple series).
	
	3. Set the video mode to graphics with _setvideomode().
	
	4. Initialize the presentation graphics environment with
	   _pg_initchart() and _pg_defaultchart().
	
	   _pg_initchart() initializes the chart linestyle set, default
	   palettes, screen modes and character fonts. It must be called
	   before any other charting function.
	
	   _pg_defaultchart() initializes all necessary variables in the chart
	   environment for the specified default chart and chart style.
	
	5. (optional) Customize your chart with the structures defined in
	   PGCHART.H. Add grid lines, size the chart, change colors, etc.
	
	6. Call the presentation graphics function that actually creates
	   the screen image, using your customized-charting environment.
	
	   _pg_chart:          creates a column, bar, or line chart for a
	                       single series of data.
	
	   _pg_chart:          creates a column, bar, or line chart for
	                       multiple series of data. All series must be
	                       the same length.
	
	   _pg_chartpie:       creates a pie chart for a single series of
	                       data.
	
	   _pg_chartscatter:   creates a scatter chart for a single series
	                       of data.
	
	   _pg_chartscatterms: creates a scatter chart for a single series
	                       of data.
	
	7. Pause while the chart is on the screen. Wait for a keystroke with
	   getch() or kbhit(), or add a timing loop.
	
	8. Reset the video mode with _setvideomode(_DEFAULTMODE).
	
	The following program illustrates the above steps, and creates a line
	chart with grid lines from a single data series:
	
	/*create line chart with grid lines from one data series*/
	
	#include <conio.h>
	#include <string.h>
	#include <graph.h>                 /* required include files */
	#include <pgchart.h>
	
	#define MONTHS 12
	
	typedef enum {FALSE, TRUE} boolean;
	
	float far value [MONTHS] =          /*value (series) data array */
	{
	 75.00, 50.00, 100.00, 45.00, 25.00, 10.00,
	 80.00, 5.00, 10.00, 15.00, 14.00, 55.00
	  };
	
	char far *category[MONTHS] =         /* category data array */
	  {
	  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jly", "Aug", "Sep", "Oct","Nov", "Dec"
	  };
	
	main()
	
	{
	chartenv env;                /* define chart environment variable */
	
	_setvideomode(_ERESCOLOR);   /* set to graphics mode */
	     /* initialize chart library and a default line chart */
	 _pg_initchart();
	 _pg_defaultchart(&env, _PG_LINECHART, _PG_POINTANDLINE);
	
	 /*add titles and some chart options -- customize the chart */
	
	 strcpy(env.maintitle.title,"Generic Analysis "); /* title text */
	 env.maintitle.titlecolor = 6;                  /* set title color */
	 env.maintitle.justify= _PG_RIGHT;              /* and position */
	 strcpy(env.subtitle.title, "Year End Report"); /* subtitle text */
	 env.subtitle.titlecolor+6;                     /* subtitle color  */
	 env.subtitle.justify=_PG_RIGHT;                /* subtitle position */
	 strcpy(env.yaxis.axistitle.title, "Month");    /* y-axis title */
	 strcpy(env.xaxis.axistitle.title, "Amount");   /* x-axis title */
	 env.xaxis.grid = TRUE;                         /* x-axis grid lines */
	 env.yaxis.grid = TRUE;                         /* y-axis grid lines */
	 env.xaxis.axiscolor = 2;                       /* color for x-axis */
	 env.yaxis.axiscolor = 5;                       /* color for y-axis */
	 env.xaxis.autoscale = FALSE;                   /* turn off autoscaling */
	 env.xaxis.scalemax = 100.00;                   /* max x-axis value */
	 env.xaxis.scalemin = 0.00;                     /* min x-axis value */
	 env.xaxis.ticformat = _PG_DECFORMAT;   /* format for x-axis tick-marks*/
	 env.yaxis.ticinterval = 1.00;          /* interval for y-axis tickmarks*/
	 env.xaxis.ticinterval = 5.00;          /* interval for x-axis tickmarks*/
	
	/* display the chart on the screen */
	
	if(_pg_chart (&env,category,value, MONTHS)) /* call to charting routine*/
	    {_setvideomode(_DEFAULTMODE);       /* error trap...*/
	     _outtext("error, can't draw chart");
	     }
	     else
	    {
	     getch();                          /* wait for a keystroke */
	     _setvideomode( _DEFAULTMODE);     /* restore the video mode */
	     }
	    return(0);
	}
