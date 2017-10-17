---
layout: page
title: "Q51866: _PG_CHART Fails to Graph Some Y-Axis Categories"
permalink: /pubs/pc/reference/microsoft/kb/Q51866/
---

## Q51866: _PG_CHART Fails to Graph Some Y-Axis Categories

	Article: Q51866
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 21-MAR-1990
	
	_PG_CHART sometimes fails to correctly graph all y-axis values. The
	program included below demonstrates this problem. The lowest bar on
	the chart should be labeled n-1 with n assumed at the origin. However,
	when n is equal to the following values
	
	   28, 30, 44, 45, 48, 51, 52, 56, 60, 63, 66, 69, 74,
	   75, 78, 79, 80, 84, 85, 88, 90, 91, 92, 95, and 96.
	
	the graph actually drawn has n-2 as the lowest bar. This is
	independent of the video mode setting.
	
	The following program demonstrates the problem:
	
	#include <conio.h>
	#include <graph.h>
	#include <pgchart.h>
	
	float far value[] = {1.0f,2.0f,3.0f,4.0f,5.0f,6.0f,7.0f,8.0f,9.0f,
	                     10.0f,11.0f,12.0f,13.0f,14.0f,15.0f,16.0f,17.0f,
	                     18.0f,19.0f,20.0f,21.0f,22.0f,23.0f,24.0f,25.0f,
	                     26.0f,27.0f,28.0f,29.0f,30.0f,31.0f,32.0f,33.0f,
	                     34.0f,35.0f,36.0f,37.0f,38.0f,39.0f,40.0f,41.0f,
	                     42.0f,43.0f,44.0f,45.0f,46.0f,47.0f,48.0f,49.0f,
	                     50.0f,51.0f,52.0f,53.0f,54.0f,55.0f,56.0f,57.0f,
	                     58.0f,59.0f,60.0f,61.0f,62.0f,63.0f,64.0f,65.0f,
	                     66.0f,67.0f,68.0f,69.0f,70.0f,71.0f,72.0f,73.0f,
	                     74.0f,75.0f,76.0f,77.0f,78.0f,79.0f,80.0f,81.0f,
	                     82.0f,83.0f,84.0f,85.0f,86.0f,87.0f,88.0f,89.0f,
	                     90.0f,91.0f,92.0f,93.0f,94.0f,95.0f,96.0f,97.0f,
	                     98.0f,99.0f,100.0f};
	
	char far *category[] ={"1","2","3","4","5","6","7","8","9","10","11",
	                        "12","13","14","15","16","17","18","19","20",
	                        "21","22","23","24","25","26","27","28","29",
	                        "30","31","32","33","34","35","36","37","38",
	                        "39","40","41","42","43","44","45","46","47",
	                        "48","49","50","51","52","53","54","55","56",
	                        "57","58","59","60","61","62","63","64","65",
	                        "66","67","68","69","70","71","72","73","74",
	                        "75","76","77","78","79","80","81","82","83",
	                        "84","85","86","87","88","89","90","91","92",
	                        "93","94","95","96","97","98","99","100"};
	void main(void)
	{
	    int i = 27;
	    chartenv env;
	    short mode = _HRES16COLOR;
	    _setvideomode(mode);
	    _pg_initchart();                 /* Initialize chart system */
	    for (; i<101; i++)
	    {
	     _pg_defaultchart(&env, _PG_BARCHART, _PG_PLAINBARS);
	     _pg_chart(&env, category, value, i);
	     getch();
	    }
	    _setvideomode(_DEFAULTMODE);
	}
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
