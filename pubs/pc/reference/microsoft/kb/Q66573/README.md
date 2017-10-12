---
layout: page
title: "Q66573: C 6.00 SAMPLES.DOC Omits CHRTOPT.C in CHARTDEMO Files List"
permalink: /pubs/pc/reference/microsoft/kb/Q66573/
---

	Article: Q66573
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 24-JAN-1991
	
	The SAMPLES.DOC file that came with the Microsoft C version 6.00
	compiler package contains a list of files required to make the
	CHRTDEMO sample application. The file fails to mention that CHRTOPT.C
	is required also.
	
	The SAMPLES.DOC file reads as follows:
	
	   CHRTDEMO.MAK       CHRTDEMO illustrates presentation graphics
	   CHRTDEMO.C         techniques. You can use this program as a tool
	   CHRTSUPT.C         for testing different modes and options before
	   CHRTDEMO.H         building them into your own programs. Real mode
	                      only.
	
	It should read as follows:
	
	   CHRTDEMO.MAK       CHRTDEMO illustrates presentation graphics
	   CHRTDEMO.C         techniques. You can use this program as a tool
	   CHRTSUPT.C         for testing different modes and options before
	   CHRTOPT.C          building them into your own programs. Real mode
	   CHRTDEMO.H         only.
