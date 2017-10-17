---
layout: page
title: "Q37004: Warning C4086 Expected"
permalink: /pubs/pc/reference/microsoft/kb/Q37004/
---

## Q37004: Warning C4086 Expected

	Article: Q37004
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QUICKC S_ERROR
	Last Modified: 12-DEC-1988
	
	The warning below is from Section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide" and Section E.3.3 (Page 269) of the
	"Microsoft C Optimizing Compiler User's Guide" for Version 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning:
	
	C4086       expected [1|2|4]
	
	            An invalid argument was given for a "pack" pragma, as
	            in the following example:
	
	            #pragma pack (yes)
	
	The "pack" pragma is used when you want to specify packing other than
	the packing specified on the command line for particular structures.
	The /Zp option and the "pack" pragma control how structure data are
	packed into memory.
	
	For detailed information on the /Zp option and the "pack" pragma, see
	Page 210 of the QuickC programmer's guide and Page 100 of the C user's
	guide.
