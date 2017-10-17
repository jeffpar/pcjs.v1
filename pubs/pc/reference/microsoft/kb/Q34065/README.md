---
layout: page
title: "Q34065: setvbuf with Buffer Greater than 32K Causes fwrite Failure"
permalink: /pubs/pc/reference/microsoft/kb/Q34065/
---

## Q34065: setvbuf with Buffer Greater than 32K Causes fwrite Failure

	Article: Q34065
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 11-AUG-1988
	
	The sample program below works correctly if the buffer size of the
	file is under 32K.  When the buffer size of the file is set higher
	than 32K (using setvbuf), the fwrite statement will fail and write
	"fwrite failed" to the screen. This problem occurs in Microsoft C
	Versions 5.00 and 5.10.
	   Page 538 of the "Microsoft C 5.1 Optimizing Compiler Run Time
	Library Reference" manual indicates that the legal values for the size
	parameter are greater than zero and less than the maximum integer
	value (which is 32K). Therefore, even though the type for the
	size parameter is of type size_t (unsigned integer) only values
	less than 32K are correct for the size parameter to setvbuf().
	   However, setvbuf should return an error for invalid size values.
	Microsoft is researching this problem and will post new information
	as it becomes available.
	
	   The following sample code demonstrates this behavior:
	
	#include <stdio.h>
	
	char buf[35000] ;   /* size of file buffer */
	FILE *stream ;
	long result ;
	int err ;
	char i[10] = "abcdefghij" ;
	
	main() {
	    stream = fopen("data1", "w+b") ;
	    if ( err = setvbuf( stream, buf, _IOFBF, sizeof(buf) ) != 0)
	        printf("failed to set buffer\n") ;
	    else
	        for ( result = 0; result < 5000; result++ )
	            if (err = fwrite( i, sizeof(i), 1, stream )  != 1 ) {
	                printf("fwrite failed\n" ) ;
	                exit(-1) ;
	                }
	}
