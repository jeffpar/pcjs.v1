---
layout: page
title: "Q57938: fread() Can Fail When Return Code for fseek() Is Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q57938/
---

## Q57938: fread() Can Fail When Return Code for fseek() Is Ignored

	Article: Q57938
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 8-MAR-1990
	
	If the return value from fseek() is ignored, subsequent calls to
	fread() can fail in certain circumstances. In OS/2, this results in a
	segmentation violation. In DOS, a wild pointer is created that could
	trash the system.
	
	The error may be difficult to reproduce because it is usually a result
	of malfunctioning or misadjusted hardware, for example, a floppy-disk
	drive that is slightly out of alignment. The error is caused by
	fseek() setting various fields in the FILE structure for the
	associated stream.
	
	Below is a code fragment from the C run-time library source for
	fread() along with a description of how the error occurs and a
	possible workaround.
	
	{File: FREAD.C}
	.
	.
	.
	  /* if the stream has a buffer */
	  if (bigbuf(stream))
	    while (pending)
	
	      /* if there are chars in the stream buffer */
	      if (stream->_cnt)
	      {
	        tempcnt = (pending < (unsigned int)stream->_cnt) ?
	        (unsigned int)pending : stream->_cnt;
	
	        memcpy(buffer,stream->_ptr,tempcnt);
	
	        stream->_ptr += tempcnt;
	        buffer += tempcnt;
	        pending -= tempcnt;
	        stream->_cnt -= tempcnt;
	      }
	.
	.
	.
	
	When an error occurs in fseek(), the _cnt field in the FILE stream
	structure is arbitrarily set to 8000h. In the above code, this caused
	tempcnt to be set to 8000h. Since the stream buffer size is by default
	512 bytes [BUFSIZE in stdio.h modifiable by setbuf()], the memcpy()
	causes the error in fread().
	
	If the existing code can't be modified to check the return value and
	recover gracefully, a temporary correction is to buy the C run-time
	library source code and modify fseek() to set _cnt to 0 (zero) if an
	error occurs. Also, whenever _cnt is set to 0, stream->_ptr should be
	set to stream->_base.
