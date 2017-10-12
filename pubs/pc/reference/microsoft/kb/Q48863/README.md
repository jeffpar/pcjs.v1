---
layout: page
title: "Q48863: CodeView String Search Length Limited to 19 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q48863/
---

	Article: Q48863
	Product: Microsoft C
	Version(s): 2.10 2.20 2.30 | 2.10 2.20 2.30
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | SR# G890810-24574 P_WinSDK
	Last Modified: 19-SEP-1989
	
	CodeView Versions 2.20 and 2.30 and CodeView for Windows Version 2.10
	have a 19-character limit in the "Find..." option of the Search menu,
	even though the dialog box is much longer than 19 characters. Entering
	a search string longer than 19 characters results in one of two error
	messages.
	
	If the search string entered is 20 or 21 characters long, CodeView
	displays the erroneous message "No match of regular expression," even
	if the search string does exist in the file. If the search string is
	22 characters or more in length, CodeView displays the more
	appropriate message "Regular expression too long."
	
	Although 19 characters sometimes can be limiting, CodeView does
	substring searches so that searching for the following
	
	   AFunctionWithAVeryL
	
	finds the following string:
	
	   AFunctionWithAVeryLongName
	
	You will have problems only if you have both of the following and
	you are trying to locate one, but not the other:
	
	   AFunctionWithAVeryLongName()
	   AFunctionWithAVeryLongParameterList(a,b,c,d,e,f,g,h,i,j)
	
	In this case, you won't be able to specify search strings long enough
	to distinguish between the two. However, you can repeatedly use the
	Next command from the Search menu to find the next occurrence of the
	following:
	
	   AFunctionWithAVeryL
	
	The Next command will find whichever of the above two function names
	that comes next in the source file.
