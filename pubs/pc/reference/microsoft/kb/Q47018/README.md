---
layout: page
title: "Q47018: Presentation Graphics Charting Function: Error Codes"
permalink: /pubs/pc/reference/microsoft/kb/Q47018/
---

	Article: Q47018
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUL-1989
	
	The following information is taken from the Presentation Graphics
	header file, PGCHART.H.
	
	Listed below are the error codes returned by the Presentation Graphics
	charting functions, which include the following:
	
	   _pg_chart                 _pg_chartms
	   _pg_chartscatter          _pg_chartscatterms
	   _pg_chartpie
	
	The error codes are as follows. Error numbers greater than 100 will
	terminate the charting routine, others will cause default values to be
	used.
	
	Manifest Constant      Value      Definition
	-----------------      -----      -----------
	
	_PG_NOTINITIALIZED     102        Charting library not initialized by
	                                  _pg_initchart and _pg_defaultchart
	_PG_BADSCREENMODE      103        Screen not set to graphics mode
	_PG_BADCHARTSTYLE       04        Invalid chart style
	_PG_BADCHARTTYPE       104        Chart type invalid
	_PG_BADLEGENDWINDOW    105        Invalid legend window specified
	_PG_BADCHARTWINDOW      07        x1=x2 or y1=y2 in chart window spec
	_PG_BADDATAWINDOW      107        If the chart window is too small
	_PG_NOMEMORY           108        Not enough memory for data arrays
	_PG_BADLOGBASE          05        Log base <= 0
	_PG_BADSCALEFACTOR      06        Scale factor = 0
	_PG_TOOSMALLN          109        Number of data points <= 0
	_PG_TOOFEWSERIES       110        Number of series <= 0
