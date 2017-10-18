---
layout: page
title: "Q34473: MASM 5.10 MACRO.DOC: Miscellaneous"
permalink: /pubs/pc/reference/microsoft/kb/Q34473/
---

## Q34473: MASM 5.10 MACRO.DOC: Miscellaneous

	Article: Q34473
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	MISCELLANEOUS
	
	@GetDate (2Ah) and @SetDate (2Bh)
	
	Gets or sets the system date
	
	Syntax:         @GetDate
	                @SetDate month, day, year
	
	Arguments:      year        = 16-bit year (1980-2099)
	                month       = 8-bit month (1-12)
	                day         = 8-bit day (1-31)
	Return:         For @GetDate:
	                        AL  = Day of week (0 = Sunday, 1 = Monday, etc.)
	                        CX  = Year (1980-2099)
	                        DL  = Month (1-12)
	                        DH  = Day (1-31)
	                For @SetDate:
	                        AL  = If date was valid 0, else -1
	Registers used: AX, CX, and DX
	
	@GetTime (2Ch) and @SetTime (2Dh)
	
	Gets or sets the system time
	
	Syntax:         @GetTime
	                @SetTime hour,minute,second,hundredth
	
	Arguments:      hour        = 8-bit hour (0-23)
	                minute      = 8-bit hour (0-59)
	                second      = 8-bit hour (0-59)
	                hundredth   = 8-bit hour (0-99)
	Return:         For @GetTime:
	                        CL  = Hour (0-23)
	                        CH  = Minute (0-59)
	                        DL  = Second (0-59)
	                        DH  = Hundredth (0-99)
	                For @SetTime:
	                        AL  = If time was valid 0, else -1
	Registers used: AX, CX, and DX
	
	@GetVer (30h)
	
	Gets the DOS version
	
	Syntax:         @GetVer
	
	Argument:       None
	Return:         AL          = Major version (0 for versions prior to
	                              2.0)
	                AH          = Minor version
	                BH          = OEM serial number
	                BL:CX       = 24-bit user number
	Register used:  AX, BX, and CX
	
	@GetInt (35h) and @SetInt (25h)
	
	Gets or sets the vector for a specified interrupt routine
	
	Syntax:         @GetInt #interrupt
	                @SetInt #interrupt, &vector [,segment]
	
	Arguments:      interrupt   = 8-bit interrupt number
	                vector      = Offset of interrupt routine
	                segment     = Segment of routine - if none given, DS
	                              assumed for data; segment ignored for
	                              code labels
	Return:         @GetInt     = None
	                @SetInt     = ES:BX points to interrupt routine
	Registers used: AX for both; ES and BX for @GetInt; DS and
	DS for @SetInt
