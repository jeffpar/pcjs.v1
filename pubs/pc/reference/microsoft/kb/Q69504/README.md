---
layout: page
title: "Q69504: _bios_disk() May Require 3 Tries for Drive to Get Up to Speed"
permalink: /pubs/pc/reference/microsoft/kb/Q69504/
---

	Article: Q69504
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-FEB-1991
	
	The _bios_disk() routine in the C run-time library uses BIOS interrupt
	0x13 to provide several disk-access functions. The ROM BIOS does not
	automatically wait for the drive to come up to speed before attempting
	to read the sector, verify the sector, or write to the sector. In the
	book "IBM ROM BIOS" by Ray Duncan, the recommendation given in each
	case is to reset the floppy disk system and try the operation three
	times before assuming an error has occurred.
	
	The following sample program from the C 6.00 online help makes three
	attempts to read the disk before giving up. A printf() statement is
	added to show which read attempt is successful.
	
	Sample Code
	-----------
	
	/* Compile options needed: none
	*/
	
	#include <stdio.h>
	#include <conio.h>
	#include <bios.h>
	#include <dos.h>
	#include <stdlib.h>
	
	char _far diskbuf[512];
	
	void main( int argc, char *argv[] )
	{
	   int count;
	   unsigned status = 0, i;
	   struct diskinfo_t di;
	   struct diskfree_t df;
	   unsigned char _far *p, linebuf[17];
	
	   if( argc != 5 )
	   {
	      printf("  SYNTAX: DISK <driveletter> <head> <track> <sector>");
	      exit( 1 );
	   }
	
	   if( (di.drive = toupper( argv[1][0] ) - 'A' ) > 1 )
	   {
	      printf( "Must be floppy drive" );
	      exit( 1 );
	   }
	
	   di.head   = atoi( argv[2] );
	   di.track   = atoi( argv[3] );
	   di.sector   = atoi( argv[4] );
	   di.nsectors = 1;
	   di.buffer   = diskbuf;
	
	   // Get information about disk size.
	
	   if( _dos_getdiskfree( di.drive + 1, &df ) )
	      exit( 1 );
	
	   // Try reading disk three times before giving up.
	
	   for( count = 1; count <= 3; count++ )
	   {
	      status = _bios_disk( _DISK_READ, &di ) >> 8;
	      if( !status )
	         break;
	   }
	
	   // Display one sector.
	   if( status )
	      printf( "Error: 0x%.2x\n", status );
	   else
	   {
	      for(p=diskbuf, i=0; p < (diskbuf+df.bytes_per_sector); p++)
	      {
	         linebuf[i++] = (*p > 32) ? *p : '.';
	         printf( "%.2x ", *p );
	         if( i == 16 )
	         {
	            linebuf[i] = '\0';
	            printf( " %16s\n", linebuf );
	            i = 0;
	         }
	      }
	   }
	
	   // Which attempt was successful?
	
	   printf( "\nThat was try #%d.\n", count );
	
	   exit( 1 );
	}
