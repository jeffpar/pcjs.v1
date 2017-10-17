---
layout: page
title: "Q42600: _imagesize Formula Documented Incorrectly for Some Video Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q42600/
---

## Q42600: _imagesize Formula Documented Incorrectly for Some Video Modes

	Article: Q42600
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 17-MAY-1989
	
	The formula given on Page 362 of the "Microsoft C for the MS-DOS
	Operating System: Run-Time Library Reference" for Optimizing C Version
	5.x and QuickC Version 1.x, and on Page 133 of the "Microsoft QuickC
	2.00 Graphics Library Reference" is incorrect for most color EGA and
	VGA video modes. The formula given is as follows:
	
	   xwid = abs(x1-x2)+1;
	   ywid = abs(y1-y2)+1;
	   size = 4+((long) ((xwid*bits_per_pixel+7)/8)*(long)ywid);
	
	This formula is accurate only for the following modes:
	
	   _MRES4COLOR
	   _MRESNOCOLOR
	   _HRESBW
	   _VRES2COLOR
	   _MRES256COLOR
	   _HERCMONO
	   _ORESCOLOR
	
	However, for most EGA and VGA color graphics modes, the correct
	formula is as follows:
	
	   xwid = abs(x1-x2)+1;
	   ywid = abs(y1-y2)+1;
	   size = 4 + ((bits_per_pixel * (long) ((xwid+7)/8)) * ywid);
	
	This formula should be used exclusively for modes that utilize bit
	planes. These modes are as follows:
	
	   _MRES16COLOR
	   _HRES16COLOR
	   _ERESCOLOR
	   _VRES16COLOR
	
	Either formula is accurate for the following modes:
	
	   _HRESBW
	   _VRES2COLOR
	   _HERCMONO
	   _ORESCOLOR
	
	A call to _getvideoconfig will determine the current video mode. This
	call is also necessary to determine the bits_per_pixel value.
	
	The following is an example of values that will yield an incorrect
	result in _VRES16COLOR mode:
	
	   x1 = 0;  y1 = 0;
	   x2 = 4;  y2 = 5;
	
	Note that for all cases, _imagesize does return the correct value.
	Only the formula given in the reference manuals is incorrect.
	
	The formula used internally by the _imagesize function is as follows:
	
	   xwid = abs(x1-x2)+1;
	   ywid = abs(y1-y2)+1;
	   size = 4+(bits_per_plane*(long) ((xwid*linear_bits_per_pixel+7)/8)*ywid);
	
	This formula is useful only for lending understanding of how the two
	prior formulas are derived. It cannot be used in a C program for the
	following reasons:
	
	1. In this formula, linear_bits_per_pixel is the actual number of
	   linear bits required to store a pixel. In the color EGA and VGA
	   modes listed, this is not equivalent to the bitsperpixel field of
	   the videoconfig structure. There is no way to determine this value
	   within C.
	
	2. There is no way to determine the bits_per_plane value within C.
	
	The formula given on Page 392 of the run-time library reference is
	correct for CGA, single-color, and _MRES256COLOR modes because bit
	planes are not utilized in storing graphic images. That is,
	bits_per_plane is equal to 1. Therefore, this factor may be simplified
	out of the equation.
	
	The formula given on Page 392 of the run-time library reference fails
	on the listed EGA and VGA modes because bit planes are implemented in
	storing graphics images under those modes. That is, bits_per_plane is
	greater than 1. Also, linear_bits_per_pixel is not equivalent to the
	bitsperpixel field of the videoconfig structure.
	
	In elaborating on the bitsperpixel field of the videoconfig structure,
	this value is as follows:
	
	   vc.bitsperpixel = linear_bits_per_pixel * bits_per_plane;
	
	For more information on bit planes and pixel maps, refer to the
	"Programmer's Guide to PC & PS/2 Video Systems" by Richard Wilton,
	Pages 87-91.
