---
layout: page
title: "Q44178: File Buffers Are Not Allocated until First Accessed"
permalink: /pubs/pc/reference/microsoft/kb/Q44178/
---

	Article: Q44178
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 22-MAY-1989
	
	Problem:
	
	I am using _memavl() to determine the amount of free space on the near
	heap. When I use fgets(), the amount of near heap space decreases by
	512 bytes.
	
	Response:
	
	File buffers are not allocated when the file is first opened. The
	512-byte buffer is allocated on the near heap when the file is first
	accessed. The buffer will be used by the file until the file is
	closed. At that time, the buffer space will be freed to the system.
	
	File buffers are allocated in the near heap for small and medium
	memory models and in the far heap for compact and large memory models.
	_memavl() returns the amount of free space on the near heap only.
	
	The following program, compiled in small or medium memory model,
	illustrates this behavior:
	
	#include <malloc.h>
	#include <stdio.h>
	
	FILE *fp;
	
	void main(void)
	{
	  char bufs[64];
	
	  printf("Start of program \n");
	  Bytes_free();
	  fp=fopen("file1.txt","r");
	
	  printf("file1.txt has been opened \n");
	  Bytes_free();
	
	  fgets(bufs,5,fp);
	  printf(" file has been accessed \n");
	  Bytes_free();
	
	  fclose(fp);
	  printf(" file has been closed \n");
	  Bytes_free();
	}
	
	Bytes_free()
	{
	  printf("\nHeap bytes free: %u \n", _memavl()  );
	}
