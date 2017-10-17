---
layout: page
title: "Q28445: Example of Calling OS/2 DosSetFSInfo and DosQFSInfo"
permalink: /pubs/pc/reference/microsoft/kb/Q28445/
---

## Q28445: Example of Calling OS/2 DosSetFSInfo and DosQFSInfo

	Article: Q28445
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is a sample program that makes OS/2 calls to DOSSetFSInfo and
	DOSQFSInfo.
	
	' The function declarations are found in file BSEDOSFL.BI
	
	TYPE FSAllocate1
	     Filesysid    AS LONG
	     SecPerUnit   AS LONG
	     NumUnits     AS LONG
	     AvailUnits   AS LONG
	     ByteSec     AS INTEGER
	END TYPE
	
	TYPE FSAllocate2
	     VolumeDate  AS INTEGER
	     VolumeTime  AS INTEGER
	     VLen        AS STRING*1
	     VLabel      AS STRING*11
	END TYPE
	
	TYPE SetInfo2
	     Vlen        AS STRING*1
	     VLabel      AS STRING*11
	END TYPE
	
	DECLARE FUNCTION DOSSetFSInfo%(_
	        BYVAL P1 AS INTEGER,_
	        BYVAL P2 AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P3o AS INTEGER,_
	        BYVAL P4 AS INTEGER)
	
	DECLARE FUNCTION DOSQFSInfo%(_
	        BYVAL P1 AS INTEGER,_
	        BYVAL P2 AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P3o AS INTEGER,_
	        BYVAL P4 AS  INTEGER)
	
	'Routine to Shift and Print Information
	
	DECLARE FUNCTION wdate$(p1 as integer)
	DECLARE FUNCTION wtime$(p1 as integer)
	DECLARE FUNCTION RightShift%(P1 as LONG,P2 as Integer)
	DECLARE FUNCTION LeftShift%(P1 as LONG, P2 as Integer)
	DECLARE FUNCTION unsigned&(P1 as integer)
	
	DEFINT a-z
	DIM info1 AS FSAllocate1
	DIM info2 AS FSAllocate2
	DIM info3 AS SetInfo2
	cls
	
	Input "Enter Drive Number (0=default, 1=A, etc) : ",drivenumber
	level = 1
	bufsize=18
	
	x = DosQFSInfo%(drivenumber,level,varseg(info1),varptr(info1),bufsize)
	
	print
	Print "Level One Information"
	print
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "File System ID : ";info1.Filesysid
	   print "Number of sectors per allocation unit : ";info1.secperunit
	   print "Number of allocation units : ";info1.numunits
	   print "Available allocation units : ";info1.availunits
	   print "Bytes per sector : ";info1.bytesec
	END IF
	
	level=2
	bufsize=16
	print
	Print "Level Two Information"
	print
	
	x = DosQFSInfo%(drivenumber,level,varseg(info2),varptr(info2),bufsize)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "Volume Creation Date : ";wdate$(info2.VolumeDate)
	   PRINT "Volume Creation Time : ";wtime$(info2.VolumeTime)
	   PRINT "Length of Label : ";asc(info2.Vlen)
	   PRINT "Volume Label : ";info2.Vlabel
	END IF
	
	print
	input "Enter the new VOLUME name : ";info3.Vlabel
	info3.vlen=chr$(len(info3.vlabel))
	info3.vlabel=info3.vlabel+chr$(0)
	level=2
	bufsize=12
	
	x = DosSetFSInfo%(drivenumber,level,varseg(info3),varptr(info3),bufsize)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   Print "The volume label is changed."
	   level=2
	   bufsize=16
	   print
	   Print "Level Two Information"
	   print
	   x = DosQFSInfo%(drivenumber,level,varseg(info2),varptr(info2),bufsize)
	   IF (x) THEN
	     Print "An error occurred.  The number is : ";x
	  ELSE
	     PRINT "Volume Creation Date : ";wdate$(info2.VolumeDate)
	     PRINT "Volume Creation Time : ";wtime$(info2.VolumeTime)
	     PRINT "Length of Label : ";asc(info2.Vlen)
	     PRINT "Volume Label : ";info2.Vlabel
	  END IF
	END IF
	
	END
	
	FUNCTION wdate$(d%) static
	DIM dl AS LONG
	    dl=unsigned&(d%)
	    mn=(RightShift%(dl,5)) AND (&h0f)
	    IF mn < 10 THEN
	       mn$="0"+ltrim$(str$(mn))
	    ELSE
	       mn$=ltrim$(str$(mn))
	    END IF
	    dy= dl AND (&h1f)
	    IF dy < 10 THEN
	       dy$="0"+ltrim$(str$(dy))
	    ELSE
	       dy$=ltrim$(str$(dy))
	    END IF
	    yr$=str$(RightShift(dl,9)+1980)
	    wdate$=mn$+"/"+dy$+"/"+ltrim$(yr$)
	END FUNCTION
	
	FUNCTION wtime$(d%)
	DIM dl AS LONG
	   dl=unsigned&(d%)
	   hr=RightShift%(dl,11) AND (&h1f)
	   IF hr < 10 THEN
	      hr$="0"+ltrim$(str$(hr))
	   ELSE
	      hr$=ltrim$(str$(hr))
	   END IF
	   mt=(RightShift%(dl,5) AND (&h3f))
	   IF mt < 10 THEN
	      mt$="0"+ltrim$(str$(mt))
	   ELSE
	      mt$=ltrim$(str$(mt))
	   END IF
	   wtime$=ltrim$(hr$)+":"+mt$+string$(5,32)
	END FUNCTION
	
	FUNCTION RightShift%(number&,amount)
	   Rightshift=number&\2^amount
	END FUNCTION
	
	FUNCTION LeftShift%(number&,amount)
	  LeftShift=number&*(2^amount)
	END FUNCTION
	
	FUNCTION unsigned&(num)
	   IF num >=0 THEN
	      unsigned&=num
	   ELSE
	      unsigned&=65536+num
	   END IF
	END FUNCTION
