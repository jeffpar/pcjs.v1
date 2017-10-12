---
layout: page
title: "Q48746: Explanation of Manifest Constants Used By _putimage()"
permalink: /pubs/pc/reference/microsoft/kb/Q48746/
---

	Article: Q48746
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM docerr
	Last Modified: 10-OCT-1989
	
	When invoking the on-line help in Microsoft QuickC Version 2.00 or
	QuickAssembler Version 2.01 for the _putimage() function, the
	description section mentions five manifests constants, but does not
	describe what they mean.
	
	The following information is taken from the "Microsoft QuickC Run-Time
	Library Reference" manual, Page 470:
	
	   _GAND     Transfers the image over an existing image on the screen.
	             The resulting image is the logical-AND product of the two
	             images: points that had the same color in both the existing
	             image and the new one will remain the same color, while
	             points that have different colors are ANDed together.
	
	   _GOR      Superimposes the image onto an existing image. The new image
	             does not erase the previous screen contents.
	
	   _GPRESET  Transfers the data point-by-point onto the screen. Each
	             point has the inverse of the color attribute it had when it
	             was taken from the screen by _getimage, producing a negative
	             image.
	
	   _GPSET    Transfers the data point-by-point onto the screen. Each
	             point has the exact color attribute it had when it was taken
	             from the screen by _getimage.
	
	   _GXOR     Causes the points on the screen to be inverted where a point
	             exists in the image buffer. This behavior is exactly like
	             that of the cursor: when an image is put against a complex
	             background twice, the background is restored unchanged. This
	             allows you to move an object around without erasing the
	             background. The _GXOR constant is a special mode often used
	             for animation.
