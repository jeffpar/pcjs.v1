---
layout: page
title: "Q51123: Time and Date Are Written When File Is Flushed"
permalink: /pubs/pc/reference/microsoft/kb/Q51123/
---

	Article: Q51123
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 30-NOV-1989
	
	Changing the time and date of a file with _dos_setftime may appear to
	fail if the file is opened for write and all data has not been written
	to disk. The DOS and OS/2 update file dates whenever a file gets
	modified. Therefore, changing a file date before the operating system
	has written all data to the physical disk may appear to be ignored.
	This is because the date is changed again when the file is closed or
	flushed if there is data still to be written.
	
	For example, the following program will try and modify the date and
	time of the output file to 6-1-89 10:00. Because the file has not been
	flushed or closed, it is likely that there is still data in the file
	buffer waiting to be written to disk. When the file is closed, the
	program will flush all remaining data to the disk, changing the date
	and time to the current date and time in the process.
	
	void main(void)
	{
	  FILE *fp;
	  fp = fopen( "outfile.txt", "wt" );
	  fprintf( fp, "Start of file\n" );
	  fprintf( fp, "End of file\n" );
	  _dos_setftime( fileno( fp ), 0x12c1, 0x5000)  //  10:00  6-1-89
	  fclose(fp);
	}
	
	One way to get around this feature of the operating system is to put a
	flush statement before the call to _dos_setftime. This ensures that
	all remaining data has been written to disk before the date is changed
	and the file is closed. The following program changes the date to
	6-1-89 10:00 successfully.
	
	void main(void)
	{
	  FILE *fp;
	  fp = fopen( "outfile.txt", "wt" );
	  fprintf( fp, "Start of file\n" );
	  fprintf( fp, "End of file\n" );
	  fflush(fp);     //       <---- flush the data to disk
	  _dos_setftime( fileno( fp ), 0x12c1, 0x5000)  //  10:00  6-1-89
	  fclose(fp);
	}
