---
layout: page
title: "Q68693: charttype Constants Are Documented with Wrong Names in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q68693/
---

	Article: Q68693
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 6-FEB-1991
	
	When using the _pg_chart() function, the first parameter is a chart
	environment pointer, which defines the structure chartenv. Within this
	structure, the first element is a short called charttype. According to
	the C 6.00 online help and the documentation in PGCHART.H, there are
	five (5) predefined constants that can be used for the charttype:
	
	   _PG_BAR     - Bar chart
	   _PG_COLUMN  - Column chart
	   _PG_LINE    - Line chart
	   _PG_SCATTER - Scatter chart
	   _PG_PIE     - Pie chart
	
	However, the actual constant names are defined to be _PG_BARCHART,
	_PG_COLUMNCHART, _PG_LINECHART, _PG_SCATTERCHART, and _PG_PIECHART.
