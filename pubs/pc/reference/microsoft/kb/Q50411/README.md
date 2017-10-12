---
layout: page
title: "Q50411: Graphics Mode: Getting More Than One Background Color"
permalink: /pubs/pc/reference/microsoft/kb/Q50411/
---

	Article: Q50411
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER| | S_QuickC S_QuickASM
	Last Modified: 17-JUL-1990
	
	It is not possible to display more than one background color on the
	screen when working in graphics mode. However, it is possible to
	present the illusion of creating different background colors for
	various windows overlaid on top of the current background color. Use
	_rectangle and _floodfill to create the windows, and either _outtext
	or _outgtext to output the text. A common application is the creation
	of a screen similar to the following:
	
	|-----------------------------------------------------------------|
	|                                                                 |
	|                                   Light Blue Background         |
	|                                                                 |
	|                |------------------------|                       |
	|                |                        |                       |
	|                |    Dark Blue           |                       |
	|                |    Background          |                       |
	|                |                        |                       |
	|                |------------------------|                       |
	|                                                                 |
	|                                                                 |
	|-----------------------------------------------------------------|
	
	This is not difficult. The primary problem is getting around the fact
	that, when using _outtext, the text always outputs on blocks of the
	current background color. The result of this is that inside of your
	dark blue window, you will have text surrounded by borders of light
	blue (not very attractive!). To work around this, you can rely on the
	fact that _floodfill() uses the foreground color as its boundary, and
	not the background color. Therefore, you can set the background and
	foreground color equal to the color of the inner window (Dark Blue
	above), and draw a rectangle with _GFILLINTERIOR to the size of the
	window you desire. Then, change the foreground color with _setcolor().
	Next, you can use _floodfill() from point (0,0) with the boundary
	color set to the same color index as the rectangle. After this, you
	can use _settextcolor() and _outtext to put text in the inner window
	without problem. An sample program, WINDOW.C, can be found in the
	"More Information:" section of this article.
	
	An easier alternative is to use QuickC's fonts. _outgtext does not
	reset the character background to the current background color.
	Instead, it draws the character over any existing images already on
	the screen. Therefore, all that is necessary is to create a filled
	rectangle of the desired size, register and set the desired font, and
	output text to that area of the screen by using _outgtext. An sample
	program, FONTS.C, can be found in the "More Information:" section of
	this article.
	
	-----------------------------------------------------------------------
	/* WINDOW.C: A sample program that illustrates changing the          */
	/* color for a window using _outtext, _floodfill, and _rectangle.    */
	
	#include <graph.h>                     /* for the graphics functions */
	#include <conio.h>                     /* for getch()                */
	
	void main(void)
	{
	_setvideomode(_ERESCOLOR);              /* set to graphics mode      */
	_setbkcolor(_BLUE);                     /* change background color   */
	_setcolor(1);                           /* set drawing color         */
	_settextcolor(3);                       /* set text color            */
	_rectangle(_GFILLINTERIOR,100,100,540,250); /* draw a window         */
	_setcolor(9);                           /* change color for fill     */
	_floodfill(0, 0, 1);                    /* fill in the background    */
	_settextposition(12, 35);               /* coordinates inside square */
	_outtext("scribble");                   /* output text inside square */
	getch();                                /* wait for a key hit        */
	_setvideomode(_DEFAULTMODE);            /* reset the video mode      */
	}
	
	/*--------------------------------------------------------------------*/
	/* FONTS.C : a slight modification to the "fonts.c" program from the  */
	/* QuickC 2.00 online help system, which outputs the fonted text onto */
	/* a "window" of a different color, easily producing the effect of    */
	/* a secondary, window-area-only background color.                    */
	
	#include <conio.h>
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	#include <graph.h>
	
	#define NFONTS 6
	
	unsigned char *face[NFONTS] =
	{
	    "Courier", "Helvetica", "Times Roman", "Modern", "Script", "Roman"
	};
	unsigned char *options[NFONTS] =
	{
	     "courier", "helv", "tms rmn", "modern", "script", "roman"
	};
	
	main ()
	{
	          unsigned char list[20];
	          char fondir[_MAX_PATH]="d:\qc2\bin";  /* modify path!!!!!   */
	          struct videoconfig vc;
	          struct _fontinfo fi;
	          short fontnum, x, y, mode = _VRES16COLOR;
	
	          /* Read header info from all .FON files in given directory. */
	          if( _registerfonts( fondir ) <= 0 )
	          {
	          _outtext( "Error: can't register fonts" );
	          exit( 1 );
	          }
	
	     /* Set highest available graphics mode and get configuration. */
	     while( !_setvideomode( mode ) )
	       mode--;
	       if( mode == _TEXTMONO)
	         exit( 1 );
	         _getvideoconfig( &vc );
	
	     /* Display each font name centered on screen. */
	     for( fontnum = 0; fontnum < NFONTS; fontnum++ )
	         {
	     /* Build options string. */
	     strcat( strcat( strcpy( list, "t'" ), options[fontnum] ), "'");
	     strcat( list, "h30w24b" );
	
	     _clearscreen( _GCLEARSCREEN );
	     if( !_setfont( list ) )
	     {
	     /* Use length of text and height of font to center text. */
	     x = (vc.numxpixels / 2) - (_getgtextextent( face[fontnum] ) / 2);
	       if( _getfontinfo( &fi ) )
	         {
	           _outtext( "Error: Can't get font information" );
	           break;
	          }
	     y = (vc.numypixels / 2) - (fi.ascent / 2);
	     _moveto( x, y );
	       if( vc.numcolors > 2 )
	      /* set up the background window & fill before text output   */
	        _setcolor( fontnum + 2);            /* set window color   */
	        _rectangle(_GFILLINTERIOR,100, 100, 540, 250);
	        _setcolor(fontnum+1);               /* set color for text */
	        _outgtext( face[fontnum] );         /* output fonted text */
	        getch();
	        }
	        else
	        _outtext( "Error: Can't set font" );
	        }
	        _unregisterfonts();           /* free up memory used by fonts*/
	        exit( !_setvideomode( _DEFAULTMODE ) );
	}
