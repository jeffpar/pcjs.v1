---
layout: page
title: "Q38026: Minimum Range Values in the Include File limits.h"
permalink: /pubs/pc/reference/microsoft/kb/Q38026/
---

	Article: Q38026
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 15-NOV-1988
	
	Question:
	
	Why is the minimum value of CHAR and INT off by one in the include
	file limits.h?
	
	Response:
	
	This behavior occurs because there is no corresponding positive value
	for the SIGNED CHAR's minimum value. For example, the range of a
	SIGNED CHAR is -128 to 127. The range specified in limits.h is -127 to
	127. The range of a signed int is -32768 to 32767, but limits.h
	specifies the range as -32767 to 32767.
	
	If you were to take the absolute value of -128 with the ABS() function,
	you would expect to get +128. This is correct; however, you must
	ensure that you store the result in a variable that has a storage
	class that can represent the value.
	
	For example, it does not make sense, and is not possible, to take the
	absolute value of -128 and try and store it in a SIGNED CHAR. 127 is
	the maximum positive value for a this storage class.
	
	The return value from the ABS() function is undefined if you try
	to store the result in a storage class that cannot represent the
	value.
