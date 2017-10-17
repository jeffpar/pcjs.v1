---
layout: page
title: "Q47159: Scaletitle Does Not Display Category Axis"
permalink: /pubs/pc/reference/microsoft/kb/Q47159/
---

## Q47159: Scaletitle Does Not Display Category Axis

	Article: Q47159
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	The presentation graphics variable "scaletitle" does not display
	labels on axes with nonvalue data. Scaletitle is part of the chart
	variable "env". As documented on Page 80 of the "Microsoft QuickC
	Graphics Library Reference," scaletitle works correctly only with
	value data.
	
	To modify the scaletitle variable, you must copy a string into the
	environment as depicted in the following source line:
	
	   strcpy(env.xaxis.scaletitle.title,"Supply vs. Demand");
	
	Scaletitle is of type "titletype", which has the following structure
	definition:
	
	typedef struct
	{
	  char    title[_PG_TITLELEN];     /* Title text */
	  short   titlecolor;              /* Palette color for the title */
	  short   justify;                 /* _PG_LEFT, _PG_CENTERAL
	                                      or _PG_RIGHT */
	} titletype;
	
	To unconditionally display axis titles, the variable "axistitle"
	should be used instead. The chart functions display these axis titles
	whether the axis is of numeric value type or string category type.
