---
layout: page
title: "Q52140: PG Chart Legend Window Is Restricted to Default Coordinates"
permalink: /pubs/pc/reference/microsoft/kb/Q52140/
---

	Article: Q52140
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	In Microsoft QuickC Versions 2.00 and 2.01 Presentation Graphics, the
	size of the legend window (like the key on a map) is restricted to the
	default. Setting "env.legend.autosize=FALSE" and manually setting
	coordinates prevents the chart from being displayed. Also, the global
	variable, errno, is set to 105, meaning "Invalid legend window
	specified."
	
	Microsoft has confirmed this to be a problem in QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
	
	The example below demonstrates the problem:
	
	/* PIE.C:  Create sample pie chart.  */
	#include <conio.h>
	#include <string.h>
	#include <graph.h>
	#include <pgchart.h>
	
	#define MONTHS 12
	
	typedef enum {FALSE, TRUE} boolean;
	
	float far value[MONTHS] =
	{
	   33.0, 27.0, 42.0, 64.0,106.0,157.0,
	  182.0,217.0,128.0, 62.0, 43.0, 36.0
	};
	char far *category[MONTHS] =
	{
	  "Jan", "Feb", "Mar", "Apr",
	  "May", "Jun", "Jly", "Aug",
	  "Sep", "Oct", "Nov", "Dec"
	};
	short far explode[MONTHS] = {0};
	
	main()
	{
	  chartenv env;
	  int mode = _VRES16COLOR, errno = 0;
	
	  /* Set highest video mode available */
	  printf ("This section displays a chart\n");
	  getch();
	  while(!_setvideomode( mode ))
	     mode--;
	  if(mode == _TEXTMONO)
	     return( 0 );
	
	  /* Initialize chart library and a default pie chart */
	  _pg_initchart();
	  _pg_defaultchart( &env, _PG_PIECHART, _PG_PERCENT );
	
	  /* Add titles and some chart options */
	  strcpy( env.maintitle.title, "Good Neighbor Grocery" );
	  env.maintitle.titlecolor = 6;
	  env.maintitle.justify = _PG_RIGHT;
	  strcpy( env.subtitle.title, "Orange Juice Sales" );
	  env.subtitle.titlecolor = 6;
	  env.subtitle.justify = _PG_RIGHT;
	  env.chartwindow.border = FALSE;
	
	  if(( errno = _pg_chartpie( &env, category, value,
	                    explode, MONTHS )) != 0)
	  {
	     _setvideomode( _DEFAULTMODE );
	     _outtext( "Error:  can't draw chart" );
	     printf ("\nerrno = %d\n", errno);
	  }
	  else
	  {
	     getch();
	     _setvideomode( _DEFAULTMODE );
	  }
	
	  printf ("The autosize coordinates are:\n");
	  printf ("x1 = %d  y1 = %d  x2 = %d  y2 = %d\n",
	          env.legend.legendwindow.x1,
	          env.legend.legendwindow.y1,
	          env.legend.legendwindow.x2,
	          env.legend.legendwindow.y2);
	  printf ("The following section will fail to display a chart\n"
	          "even though I set manual coordinates = autosize coordinates\n");
	  getch();
	  _setvideomode( mode );
	  env.legend.autosize = FALSE;
	  env.legend.legendwindow.x1 = 573;
	  env.legend.legendwindow.y1 = 36;
	  env.legend.legendwindow.x2 = 631;
	  env.legend.legendwindow.y2 = 192;
	  if(( errno = _pg_chartpie( &env, category, value,
	                    explode, MONTHS )) != 0)
	  {
	     _setvideomode( _DEFAULTMODE );
	     _outtext( "Error:  can't draw chart" );
	     printf ("\nerrno = %d\n", errno);
	  }
	  else
	  {
	     getch();
	     _setvideomode( _DEFAULTMODE );
	  }
	  printf ("The manual coordinates are:\n");
	  printf ("x1 = %d  y1 = %d  x2 = %d  y2 = %d\n",
	          env.legend.legendwindow.x1,
	          env.legend.legendwindow.y1,
	          env.legend.legendwindow.x2,
	          env.legend.legendwindow.y2);
	   return(0);
	}
