---
layout: page
title: "Q43375: QuickC: Version 2.00 Search and Replace Problem"
permalink: /pubs/pc/reference/microsoft/kb/Q43375/
---

	Article: Q43375
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 2-MAY-1989
	
	The QuickC Version 2.00 editor will appear to crash when a search and
	replace is done under the following conditions:
	
	1. Replace an uppercase string with a lowercase string of the same
	   name.
	
	2. The cursor must be placed one character after the word being
	   replaced.
	
	To duplicate this behavior perform the following steps inside the
	editor:
	
	1. Type the following (leave the cursor after the "S"):
	
	      REPLACETHIS
	
	2. Use the command CONTROL+Q and set the following:
	
	      Find What = REPLACETHIS
	      Change to = replacethis
	
	3. Leave the other options at their default values and select "find
	   and verify" or "change all".
	
	The search and replace seems to go into an infinite loop. If you
	select the "find and verify" option you can cancel to get out of the
	loop.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
