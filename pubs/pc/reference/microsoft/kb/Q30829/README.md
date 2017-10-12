---
layout: page
title: "Q30829: Setting TMPSAV in TOOLS.INI file; M.TMP Cannot Be Suppressed"
permalink: /pubs/pc/reference/microsoft/kb/Q30829/
---

	Article: Q30829
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | TAR76606
	Last Modified: 8-JUN-1988
	
	Question:
	   How do I get the Microsoft Editor (both ME and MEP) to not create
	and use the M.TMP to record past editing sessions?
	   I have tried setting the switch tmpsave:0 in the TOOLS.INI file,
	but this does not solve the problem. Is there some other switch I have
	not set properly or a way to exit without creating M.TMP?
	
	Response:
	   There is no way to prevent the creation of the temporary file.
	   The TMPSAV switch is used to control the maximum number of files
	about which information is kept between editing sessions. This
	information includes the cursor position and window layouts.
	   When you edit one of these files again, the screen starts up as you
	left it. The default value is 20. If TMPSAV is set to 0, it causes all
	files to be saved. All other numeric values refer to the number of
	files that will be saved. The /t option specifies that any files
	edited are temporary; they are not saved in the M.TMP file.
