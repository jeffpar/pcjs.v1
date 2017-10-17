---
layout: page
title: "Q32003: Assigning Addresses to Overlay Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q32003/
---

## Q32003: Assigning Addresses to Overlay Segments

	Article: Q32003
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JUL-1988
	
	The linker assigns only code segments (identified by class names
	ending in "CODE") to overlays. Data segments go in the root. The
	particular overlay the segment goes in is determined by the module
	that first defines the segment.
	
	   Note that the linker assigns segments, not object modules, to
	overlays. Therefore, if you have the following command
	
	    LINK A+(B+C)
	
	where
	
	    A   defines public SEG1
	    B   defines public SEG2
	    C   defines public SEG1
	
	then C's contribution to SEG1 goes in the root, not in the first
	overlay, because SEG1 was first defined in a root module.
	   The linker orders all segments as it normally would, ignoring the
	overlays and using the class and combine-type rules described
	elsewhere. The linker then assigns addresses for every segment in the
	root up to the first overlay segment. Before the first overlay
	segment, it defines a special empty segment called OVERLAY_AREA. Then
	for each overlay it assigns addresses for every segment in the overlay
	so that the first segment in the overlay starts at OVERLAY_AREA. One
	particular overlay will end at a higher address than all the others;
	at this address, the linker defines a special empty segment called
	OVERLAY_END. Finally, the linker assigns addresses for all remaining
	segments in the root so that the first one starts at OVERLAY_END. The
	load image looks like the following:
	
	        ------------+-> 0000
	        |           |
	        |  root     |
	        |           |
	        +-----------+-> OVERLAY_AREA
	        |  overlay  |
	        |  area     |
	        |           |
	        +-----------+-> OVERLAY_END
	        |  root     |
	        +-----------+
	
	   The resultant MAP file has some different contents than the
	pre-overlay file. All items listed are declared as "res", meaning
	resident. The items contained within the overlay modules are also
	declared as "res".
	   At the top of the MAP file, the segments are listed in the exact
	order in which they will be in the load image, and each segment is
	identified as being in a particular overlay or the root.
	   Every symbol marked "res" is in a root segment and every symbol
	marked "ovl" is in an overlay segment. If symbols are not where you
	think they ought to be, remember the linker assigns segments, not
	modules, to overlays.
	   For more information on overlays, refer to the 1988 "MS-DOS
	Encyclopedia."
