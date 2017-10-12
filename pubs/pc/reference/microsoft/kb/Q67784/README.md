---
layout: page
title: "Q67784: C 6.00/6.00a May Incorrectly Generate C4009 Warning with /Zg"
permalink: /pubs/pc/reference/microsoft/kb/Q67784/
---

	Article: Q67784
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	When compiling with the "/Zg" option in C version 6.00 or 6.00a, a
	C4009 (string too big, trailing characters truncated) warning error
	may be incorrectly flagged. In the sample code below, a local array of
	strings of total size greater than 2K will generate the warning. If
	the array is made global or the total size is less than 2K, the
	warning is not generated.
	
	Sample Code
	-----------
	
	void main(void) { }
	
	int test(void) {
	
	char * test_array[3][35] = {
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	"xxxxxxxxxxxxxxxxxxxx","yyyyyyyyyyyyyyyyyyy","zzzzzzzzzzzzzzzzzzzz"
	};
	
	}
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
