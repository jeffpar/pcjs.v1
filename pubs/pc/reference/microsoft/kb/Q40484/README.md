---
layout: page
title: "Q40484: QuickC 2.00 Does Not Automatically Change Memory Models"
permalink: /pubs/pc/reference/microsoft/kb/Q40484/
---

	Article: Q40484
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	On Page 15 of the January 16, 1989 edition of InfoWorld the article
	"Microsoft Offers Quick C Upgrade" appeared, which contained the
	following quote from a Microsoft marketing manager:
	
	   "QuickC 2.00 detects when you've gotten to the end of the current
	   memory model and will automatically pop to the next model."
	
	This is an error and is not reflective of any actual QuickC ability.
	If the current memory model is insufficient for compilation or
	linking, then error messages are produced and you have to re-examine
	the code or choose the option for a different, more adequate memory
	model.
