---
layout: page
title: "Q51613: The /Gm Switch Really Does Move Constants to _CONST"
permalink: /pubs/pc/reference/microsoft/kb/Q51613/
---

## Q51613: The /Gm Switch Really Does Move Constants to _CONST

	Article: Q51613
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-DEC-1989
	
	Question:
	
	I am using the /Gm switch to move near string constants into the
	_CONST segment, but it doesn't seem to work properly. My program is
	shown below:
	
	   char foo[] = "hello";
	
	   void main(void)
	   {
	   }
	
	When I examine the map file generated, it tells me that foo is stored
	in _DATA. Why isn't the string constant "hello" being stored in
	_CONST?
	
	Response:
	
	The /Gm switch is behaving as it should. In the above case, the string
	constant "hello" is not stored as a constant, it is merely a shorthand
	way of initializing the array foo. For example,
	
	   char foo[] = "hello";
	
	is equivalent to saying the following:
	
	   char foo[] = {'h','e','l','l','o','\0'};
	
	The data in the array foo is not a string constant, and therefore,
	should not be moved to the _CONST section with the /Gm switch.
	
	The following code demonstrates a few string constants:
	
	   #include <stdio.h>
	
	   void main(void)
	   {
	       char array[] = "This is NOT a string constant.";
	
	       char *foo = "This would be moved out to _CONST with /Gm";
	       printf("This string will be moved to _CONST\n");
	    }
