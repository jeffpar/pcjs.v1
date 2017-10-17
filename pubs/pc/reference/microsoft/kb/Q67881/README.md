---
layout: page
title: "Q67881: C 6.00 Pragmas Supported by QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q67881/
---

## Q67881: C 6.00 Pragmas Supported by QuickC

	Article: Q67881
	Version(s): 2.50 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-JAN-1991
	
	The QuickC online help system documents support for the following four
	pragmas:
	
	   check_stack, check_pointer, message, and pack
	
	Six pragmas are actually supported, but using any of the others (which
	are also supported by the C 6.00 compiler) with QuickC will have no
	effect, even though warnings are generated for only four of them.
	
	Below is a list of pragmas supported by the C compiler version 6.00
	and the behavior exhibited by QuickC versions 2.00 and 2.50 when they
	are encountered in a source file. Those that are not supported and
	that actually issue a warning will generate the following warning
	message:
	
	   C4118: pragma not supported
	
	   A pragma that the compiler does not support was used. The pragma
	   was ignored.
	
	   Pragma                       Behavior
	   ------                       --------
	
	   #pragma alloc_text()         Supported but not documented
	
	   #pragma check_pointer()      Supported and documented
	
	   #pragma check_stack()        Supported and documented
	
	   #pragma comment()            Not supported -- issues a warning at level
	                                3 and above.
	
	   #pragma intrinsic()          Not supported -- issues a warning at level
	                                1 and above.
	
	   #pragma function()           Not supported -- issues a warning at level
	                                1 and above.
	
	   #pragma linesize()           Not supported -- ignored (but is only
	                                useful with /Fs, which is not
	                                supported by QuickC).
	
	   #pragma loop_opt()           Supported (but only with -Ol -- otherwise
	                                ignored).
	
	   #pragma message()            Supported and documented.
	
	   #pragma optimize             Not supported -- ignored.
	
	   #pragma pack()               Supported and documented.
	
	   #pragma page()               Not supported -- ignored, same as
	                                linesize.
	
	   #pragma pagesize()           Not supported -- ignored, same as
	                                linesize.
	
	   #pragma same_seg()           Not supported -- issues a warning at level
	                                1 and above.
	
	   #pragma skip()               Not supported -- ignored, same as
	                                linesize.
	
	   #pragma subtitle()           Not supported -- ignored, same as
	                                linesize.
	
	   #pragma title()              Not supported -- ignored, same as
	                                linesize.
