---
layout: page
title: "Q30421: Extra Line-Feed Character Generated in Four-Digit Listing File"
permalink: /pubs/pc/reference/microsoft/kb/Q30421/
---

## Q30421: Extra Line-Feed Character Generated in Four-Digit Listing File

	Article: Q30421
	Version(s): 5.1O
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	If the date in the file-header listing has four digits (e.g.
	1/2/88), MASM will produce a file listing with extra line-feed
	characters on the page headings.
	   For example, compare the following listings, differing only by
	their dates:
	
	Listing 1:
	Microsoft (R) Macro Assembler Version 5.10          1/2/88 19:55:07
	                                                    Page    1-1
	Listing 2:
	Microsoft (R) Macro Assembler Version 5.10          1/23/88 19:55:07
	                                                    Page    1-1
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
