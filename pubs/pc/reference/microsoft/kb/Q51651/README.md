---
layout: page
title: "Q51651: Formatted Listings Are Not Created in Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q51651/
---

## Q51651: Formatted Listings Are Not Created in Environment

	Article: Q51651
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-MAR-1990
	
	Creating formatted listings to include page breaks and page headers is
	not possible within the Quick Assembler environment.
	
	It might appear that this could be done because within the Quick
	Assembler environment, you can choose to have a listing created and
	then view that listing after it has been created.
	
	It then follows that this listing would be of the same format as the
	one that can be created from the command line (using QCL). However,
	this is not the case. The listings that are created within the
	environment do not contain either page headers or page breaks.
	
	If you want to put page breaks in the document, a comment can
	be entered as follows:
	
	   ; [ALT 12]
	
	This will put the formfeed character into the document and cause the
	listing to page forward when it is printed.
