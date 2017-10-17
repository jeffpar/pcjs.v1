---
layout: page
title: "Q47235: Scaling Values for PG Charts Do Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q47235/
---

## Q47235: Scaling Values for PG Charts Do Not Work Correctly

	Article: Q47235
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 buglist2.01
	Last Modified: 10-OCT-1989
	
	There is a problem with the scaling routines that are part of the
	QuickC 2.00 Presentation Graphics library. The "scalefactor" structure
	member of the axistype structure is not calculated correctly. The
	program included below demonstrates the problem. It draws a default
	bar chart, which displays with no problems. However, when a
	scalefactor of (first) 100, and (second) 1000 is defined, obvious
	difficulties arise. Some values are calculated incorrectly, and other
	values disappear from the graph altogether. The only changes that are
	made to the default charting environment deal with the scaling factor:
	
	1. The addition of a scaling factor other than 0.
	
	2. Resetting the maximum value for the x-axis.
	
	3. Resetting the tic-interval for the x-axis.
	
	When the scalefactor is set to a small value (in the 2.00 - 50.00
	range) it seems to be ignored altogether. Microsoft has confirmed that
	this is a problem with the QuickC 2.00 and 2.01 Presentation Graphics
	library. We are researching this problem and will post new information
	as it becomes available. At present, there is no workaround for the
	problem.
	
	The following program demonstrates the problem:
	/*----------------------------------------------------------------*/
	/* This routine draws a simple bar chart (plain bar style) to     */
	/* demonstrate a problem with the "scalefactor" setting           */
	/* which is defined in the "axistype" structure in PGCHART.H.     */
	/* The program defines and draws the chart three times:           */
	/*   1. with no scaling factor set.                               */
	/*   2. with the scaling factor set to 100                        */
	/*   3. with the scaling factor set to 1000                       */
	/* The only other change made is to change the axistitle and      */
	/* and the minimum and maximum scaling axis values accordingly.   */
	/* Problem: The "scaled" output is very inconsistent. Some        */
	/* values are scaled incorrectly, and some disappear from the     */
	/* chart altogether.                                              */
	
	#include <conio.h>
	#include <string.h>
	#include <graph.h>                 /* required include files */
	#include <pgchart.h>
	
	#define MONTHS 12
	
	typedef enum {FALSE, TRUE} boolean;
	
	float far value [MONTHS] =          /*value (series) data array */
	{
	 (float)1000.00, (float)2000.00, (float)3000.00, (float)4000.00,
	 (float)5000.00, (float)6000.00,(float)7000.00, (float)8000.00,
	 (float)9000.00, (float)10000.00, (float)11000.00, (float)12000.00
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
	                 /* initialize chart library and a default bar chart */
	 _pg_initchart();
	
	_pg_defaultchart(&env, _PG_BARCHART, _PG_PLAINBARS);
	
	                            /*add titles and some chart options       */
	 strcpy(env.xaxis.axistitle.title, "Simple bar chart, no scale factor");
	 env.xaxis.autoscale = FALSE;           /* turn off autoscaling       */
	 env.xaxis.scalemax = (float)15000.00;  /* max x-axis value           */
	 env.xaxis.scalemin = (float)0.00;      /* min x-axis value           */
	 env.xaxis.ticinterval = (float)1000.00;/* interval for x-axis tickmarks*/
	
	if(_pg_chart (&env,category,value, MONTHS)) /* call to charting routine*/
	        {_setvideomode(_DEFAULTMODE);       /* error trap...          */
	         _outtext("error, can't draw chart");
	         }
	     else
	        {
	         getch();                          /* wait for a keystroke */
	         }
	 /*********************************************************************/
	 /* same chart, same series, scaled by a factor of 100 */
	 strcpy(env.xaxis.axistitle.title,"Same chart, scalefactor set to 100");
	 env.xaxis.autoscale = FALSE;           /* turn off autoscaling */
	 env.xaxis.scalemax = (float)150.00;    /* max x-axis value */
	 env.xaxis.scalemin = (float)0.00;      /* min x-axis value */
	 env.xaxis.ticinterval = (float)10.00;  /* interval for x-axis tickmarks*/
	 env.xaxis.scalefactor = (float)100.00;
	
	if(_pg_chart (&env,category,value, MONTHS)) /* call to charting routine*/
	        {_setvideomode(_DEFAULTMODE);       /* error trap...*/
	         _outtext("error, can't draw chart");
	         }
	                 else
	        {
	         getch();                             /* wait for a keystroke */
	         }
	 /********************************************************************/
	 /* same chart, same series, scaled by a factor of 1000              */
	 strcpy(env.xaxis.axistitle.title,"Same chart, scalefactor set to 1000");
	 env.xaxis.autoscale = FALSE;           /* turn off autoscaling */
	 env.xaxis.scalemax = (float)15.00;  /* max x-axis value */
	 env.xaxis.scalemin = (float)0.00;      /* min x-axis value */
	 env.xaxis.ticinterval = (float)1.00;  /* interval for x-axis tickmarks*/
	 env.xaxis.scalefactor = (float)1000.00;
	
	if(_pg_chart (&env,category,value, MONTHS)) /* call to charting routine*/
	        {_setvideomode(_DEFAULTMODE);       /* error trap...*/
	         _outtext("error, can't draw chart");
	         }
	                 else
	        {
	         getch();                          /* wait for a keystroke */
	         }
	
	/********************************************************************/
	        _setvideomode(_DEFAULTMODE);      /* reset the video mode  */
	
	         return(0);
	         }
