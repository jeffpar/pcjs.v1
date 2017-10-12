---
layout: page
title: "Q43330: How to Use _remappalette in EGA Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q43330/
---

	Article: Q43330
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	When attempting to remap the palette in the EGA modes, follow the
	required format to form the argument passed to the remapping
	functions. This article uses _remappalette as an example. What is said
	about lColor (see function prototype below) also applies to the
	element of the array slColors for _remapallpalette.
	
	The function prototypes are as follows:
	
	short far _remappalette (nPixel, lColor) ;
	short nPixel ;
	long lColor ;                   Color number to assign nPixel to
	
	short far _remapallpalette (slColors) ;
	long far * slColors ;           Color array
	
	lColor is a long int formed by the following four bytes:
	
	    00, blue byte, green byte, red byte
	
	The four bytes are arranged from the most significant byte to the
	least significant byte (left to right). The most significant byte is
	always "0" (zero). Each of the remaining three bytes can have the
	value of either 00, 2a, 15, or 3f. (In VGA mode, each byte can take
	any value between 00 and 3f.) Combinations of different values in the
	three bytes form the complete palette of 64 colors for the EGA
	graphics modes.
	
	The manifest constants for the EGA modes are _MRES16COLOR,
	_HRES16COLOR, and _ERESCOLOR, which are used with the function
	_setvideomode.
	
	Please refer to the include file "GRAPH.H" for the default values of
	the 16 colors in an EGA mode.
	
	An algorithm is provided in this section to convert a color
	represented by an arbitrary number from 0 - 63 to the required format.
	A sample program is included that implements the algorithm.
	
	Suppose the color is represented by a byte, as follows:
	
	   bit7 , bit6 , bit5 , bit4 , bit3 , bit2 , bit1 , bit0
	
	1. bit7 and bit6 can be ignored, because the byte is always less than
	   64.
	
	2. The remaining bits are grouped in the following three pairs, where
	   the order of the two bits in the pair is significant:
	
	   bit3 , bit0 ;
	   bit4 , bit1 ;
	   bit5 , bit2 ;
	
	3. Each pair is mapped to 00, 2a, 15, or 3f, according to the
	   following table:
	
	   bitX   bitY   MappedXY
	     0      0      00
	     0      1      2a
	     1      0      15
	     1      1      3f
	
	4. Mapped30 (from pair bit3, bit0) goes to the blue byte.
	   Mapped41 (from pair bit4, bit1) goes to the green byte.
	   Mapped52 (from pair bit5, bit2) goes to the red byte.
	
	   The order (from high to low) of the three bytes is as follows:
	
	      blue byte  ,  green byte  ,  red byte
	
	5. Example:
	
	   Color 43 has bit pattern 0 0 1 0 1 0 1 1. This pattern is
	   transformed to three pairs : 11, 01, 10. The three pairs are mapped
	   to 3f, 2a, 15. The mapped color represented in long integer format
	   is 0x3f2a15.
	
	The following program uses _remappalette to remap the color "0" (which
	defaults to black) to the 64 different colors:
	
	// file : palette.c
	
	#include <stdio.h>
	#include <graph.h>
	#include <conio.h>
	
	#define NUMCOLOR        64
	#define MASK            0x0001
	
	unsigned long ConvertColNum (unsigned int) ;
	
	unsigned char ConvertArr [4] = { 0x00, 0x2a, 0x15, 0x3f } ;
	
	void main (void)
	{
	unsigned short nColor = 0 ;
	unsigned int i ;
	unsigned long lMappedColor ;
	
	if (!_setvideomode (_ERESCOLOR))
	    return ;
	
	puts ("Press any key to continue ...") ;
	getch () ;
	
	for (i = 0 ; i < NUMCOLOR ; i++)
	    {
	    lMappedColor = ConvertColNum (i) ;
	    if (_remappalette (nColor, lMappedColor) == -1L)
	        puts ("\x007Mapping color failed : ") ;  // beep if fails
	
	    printf ("Color number = %u, lMappedColor = %08lx\n", i,
	            lMappedColor);
	    if (getch () == 'q')
	        break ;
	    }
	
	_setvideomode (_DEFAULTMODE) ;
	}
	
	unsigned long ConvertColNum (unsigned int nOrgColor)
	{
	    unsigned long lColor, lTemp ;
	    int j, temp ;
	
	    lColor = 0L ;
	    for (j = 0 ; j < 3 ; j++)
	        {
	        // get the pair
	        temp = ((nOrgColor >> (j + 3) & MASK) << 1 ) |
	                (nOrgColor >> j & MASK) ;
	        lTemp = (unsigned long) ConvertArr [ temp ] ;
	        lColor |= lTemp << ((2-j) << 3) ;      // (2-j) * 8
	        }
	
	    return (lColor) ;
	}
