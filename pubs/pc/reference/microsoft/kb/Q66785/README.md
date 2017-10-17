---
layout: page
title: "Q66785: Extended ASCII Characters on CGA Card"
permalink: /pubs/pc/reference/microsoft/kb/Q66785/
---

## Q66785: Extended ASCII Characters on CGA Card

	Article: Q66785
	Version(s): 5.10 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist5.10 buglist6.00 buglist6.00a s_quickc
	Last Modified: 9-NOV-1990
	
	The _outtext() function from the graphics library will not display
	extended ASCII characters on a CGA adapter while in graphics mode
	(_MRESNOCOLOR, _MRES4COLOR, _HRESBW). The _outtext() function will
	display characters with values greater than 128 on VGA adapters in all
	display modes. However, _outtext() will only display shaded blocks for
	these characters on CGA systems working in the above mentioned
	graphics modes.
	
	Microsoft has confirmed this to be a problem in all versions of
	GRAPHICS.LIB up to and including the version that shipped with
	Microsoft C version 6.00a and Microsoft Quick C versions 2.50 and
	2.51. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	#include <conio.h>
	#include <graph.h>
	
	void PrintItOut (void);
	void main(void);
	
	char buf1 [65];
	char buf2 [65];
	char buf3 [65];
	
	void main(void)
	{
	   int i;
	
	   for( i = 0; i < 64; i++ )
	   {
	      buf1[i]= (char) 32+i;
	      buf2[i]= (char) 96+i;
	      buf2[i]= (char) 160+i;
	   }
	   buf1[i]= 0;
	   buf2[i]= 0;
	   buf3[i]= 0;
	
	   _setvideomode( _MRES4COLOR);
	
	   PrintItOut();
	
	   _setvideomode( _MRESNOCOLOR);
	
	   PrintItOut();
	
	   _setvideomode( _HRESBW);
	
	   PrintItOut();
	
	   _setvideomode( _DEFAULTMODE);
	}
	void PrintItOut (void)
	{
	   _clearscreen( _GCLEARSCREEN );
	   _setbkcolor( 0 );
	   _settextposition( 3, 1 );
	   _settextcolor( 15 );
	   _outtext( buf1 );
	   _outtext( buf2 );
	   _outtext( buf3 );
	
	   getch();
	}
