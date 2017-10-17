---
layout: page
title: "Q46848: TAB Function Documentation Error in QuickBASIC 4.50 Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q46848/
---

## Q46848: TAB Function Documentation Error in QuickBASIC 4.50 Manual

	Article: Q46848
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890627-141 docerr
	Last Modified: 8-DEC-1989
	
	The example for the TAB function on Page 369 of the "Microsoft
	QuickBASIC 4.5: BASIC Language Reference" for Version 4.50 is
	incorrect. The output for the first display is in Column 1 when it
	should be in Column 7.
	
	This is not an error in the following:
	
	1. The on-line help for the QuickBASIC 4.50 environment
	
	2. The on-line help for the BASIC PDS 7.00 QuickBASIC Extended
	   environment
	
	3. The "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	   Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	4. The "Microsoft BASIC 7.0: BASIC Language Reference" manual for
	   Version 7.00
	
	5. The "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	   Versions 4.00 and 4.00b
	
	The output on Page 369 should correctly show
	
	       one
	               two
	three
	0123456789012345678901234567890
	                    four
	
	to correspond to the code given for the TAB function.
