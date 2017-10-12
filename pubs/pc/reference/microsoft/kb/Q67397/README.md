---
layout: page
title: "Q67397: Hyperlink for MakeProcInstance in SDKADV.HLP Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q67397/
---

	Article: Q67397
	Product: Microsoft C
	Version(s): 1.70   | 1.70
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_qh docerr
	Last Modified: 17-DEC-1990
	
	When accessing the function MakeProcInstance() from the index in
	QuickHelp version 1.70, the help screen for Windows DataTypes is
	presented instead. This behavior may be duplicated by following the
	procedure outlined below:
	
	Start QuickHelp with an argument to get help on any windows topic, as
	follows:
	
	   qh wndclass
	
	This will bring up the help screen for the wndclass structure. Now
	click the right button on the QuickHelp index, and then on the
	alphabetical section for M. At this point, if help for
	MakeProcInstance() is chosen, QuickHelp will, instead, bring up the
	help screen for Windows Data Types.
	
	If the SDKADV.HLP file is decoded using HELPMAKE, as follows
	
	   helpmake /D /Osdk.doc sdkadv.hlp
	
	it becomes obvious that the reason for this error is that the
	hyperlink for MakeProcInstance() appears as follows in the decoded
	help file:
	
	   \aMakeProcInstance function \vDatatypes\v
	
	This causes QuickHelp to display the DataTypes help screen instead of
	help for the appropriate function.
	
	This problem can be corrected by changing the above line to read as
	follows:
	
	   \aMakeProcInstance function \vMakeProcInstance\v
	
	The SDKADV.HLP file must then be recompressed, as follows:
	
	   helpmake /E0 /T /Osdkadv.hlp sdk.doc
	
	The choice of /E0 indicates no compression, and is strictly arbitrary
	in this case. If maximum compression is desired, the 0 argument to the
	/E switch may be left off, or /E15 may be specified.
