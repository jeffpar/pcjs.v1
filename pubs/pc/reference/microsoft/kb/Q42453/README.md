---
layout: page
title: "Q42453: Clarification of fcvt() Function"
permalink: /pubs/pc/reference/microsoft/kb/Q42453/
---

## Q42453: Clarification of fcvt() Function

	Article: Q42453
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	This article is meant to clarify the description of the fcvt()
	function in the "Microsoft C for the MS-DOS Operating System: Run-Time
	Library Reference," Pages 251-252.
	
	The fcvt() function converts a floating-point number to a
	null-terminated character string. The number of digits converted
	depends on the second parameter passed. This second parameter is
	called "count" for the remainder of this article.
	
	The function is designed to return all the digits to the left of the
	decimal point, and then count digits to the right. Once the string is
	converted, all leading zeros are removed unless the number passed was
	zero (see Example 4 below). The string will be terminated with the
	"/0" character. The decimal point is not included in the string, and
	its position can be obtained from the third parameter (see the
	documentation).
	
	Based on this description, the following examples apply. In all cases,
	count = 8. The examples are as follows:
	
	1. Number passed: 3.667      String returned: "366700000\0"
	
	   Nine digits are returned: one for the number to the left of the
	   decimal point, eight more because of the count parameter.
	
	2. Number passed: 3.67E-08   String returned: "3\0"
	
	   In this case, only "3" is returned because after the number is
	   converted, all the leading zeros are removed.
	
	3. Number passed: 1.023E-12  String returned: "\0"
	
	   In this case, a NULL string is returned because only zeros are left
	   after the conversion, and these are all removed from the resulting
	   string. If error checking were being performed, this would indicate
	   a conversion underflow.
	
	4. Number passed: 0          String returned: "00000000\0"
	
	   This is the only "special" case. Eight zeros are returned so that
	   error checking can be performed easily.
