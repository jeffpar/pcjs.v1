---
layout: page
title: "Q47660: Only One Scaletitle May Appear in Bar, Column, and Line Charts"
permalink: /pubs/pc/reference/microsoft/kb/Q47660/
---

	Article: Q47660
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-OCT-1989
	
	Question:
	
	When using Presentation Graphics to display bar charts, I cannot get
	the scaletitle to display for both axes. I have set up titles exactly
	as in the examples, and I have done everything the same for both axes.
	Yet, when I run my program, I get both axistitles and only one of the
	scaletitles. What am I doing wrong?
	
	Response:
	
	When you are displaying bar, column, or line charts, you may only have
	a scaletitle on one axis. Scaletitles can be used only on a value axis
	to describe value data; that is, the data must be numeric data that
	can have a scalefactor applied to it. In a bar, column, or line chart,
	one axis has value data and the other has category data that the
	values fit into; therefore, only one axis can have a scaletitle.
	
	A scaletitle is defined as "a string of text that describes the value
	of scalefactor."  For example, the scaletitle "(x 1000)" signifies
	that the units of this particular axis are "times 1000". Thus,
	scaletitles are useful only for charts with large units, such as
	millions, where you would not want to crowd your axis with something
	similar to the following:
	
	1000000 2000000 3000000 4000000 5000000 6000000 7000000 8000000
	
	Instead, using  "1   2   3   4   5   6   7   8" (without the quotation
	marks) on the axis ticks, with a scaletitle of "(x 1000000)", is a
	much neater way of presenting the chart.
	
	The scaled data in a chart is relevant only when it is viewed in the
	context of some category that gives it a frame of reference. For
	instance, categories could be the months of the year or the sales
	regions for a company to which the data pertains. Thus, one axis must
	contain categorical information (nonvalue data) that serves as the
	comparison basis for the numeric value data. The categorical axis is
	the one where you cannot have a scaletitle.
	
	In a bar chart, the x-axis contains the numeric data, and therefore,
	may have a scaletitle. In a column or line chart, the y-axis is the
	value axis that can have the scaletitle. Only in a scatter chart,
	where both axes may contain numeric values, are you allowed to put
	scaletitles on both axes.
	
	The scaletitle variable is part of the chart environment (chartenv)
	variable "env". To modify the scaletitle variable, you must copy a
	string into one of the axis variables in the chart environment as
	depicted in the following source line:
	
	   strcpy(env.xaxis.scaletitle.title,"x 10000");
	
	Scaletitle is of type "titletype", which has the following structure
	definition:
	
	typedef struct {
	  char    title[_PG_TITLELEN];     /* Title text */
	  short   titlecolor;              /* Palette color for the title */
	  short   justify;                 /* _PG_LEFT, _PG_CENTERAL or
	  _PG_RIGHT */
	} titletype;
	
	If you want to put other information alongside an axistitle that is
	not scalefactor information, then you should use the _pg_hlabelchart
	and _pg_vlabelchart functions. These functions allow you to output
	text anywhere on a chart in either a horizontal or vertical
	orientation. All you need to specify with these functions is the
	starting screen coordinates, the length of the output string, and the
	text to output.
	
	For more information on these functions, or to learn more about
	chartenv types, axistypes, and titletypes, see the Presentation
	Graphics chapter in "C for Yourself," the QuickC on-line help, or the
	"Microsoft QuickC Graphics Library Reference."
