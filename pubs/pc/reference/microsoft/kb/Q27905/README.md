---
layout: page
title: "Q27905: Sample Program That Makes OS/2 CALL DosSetDateTime"
permalink: /pubs/pc/reference/microsoft/kb/Q27905/
---

## Q27905: Sample Program That Makes OS/2 CALL DosSetDateTime

	Article: Q27905
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is an example of how to make the DosSetDateTime OS/2 call.
	
	' The user-defined TYPE and function DECLARE are found in BSEDOSPE.BI
	TYPE DateTime
	     Hour        AS STRING*1
	     Minutes     AS STRING*1
	     Seconds     AS STRING*1
	     Hundredths  AS STRING*1
	     Day         AS STRING*1
	     Month       AS STRING*1
	     Year        AS INTEGER
	     Timezone    AS INTEGER
	     DayOfWeek   AS STRING*1
	END TYPE
	
	DECLARE FUNCTION DosSetDateTime%(SEG P1 AS DateTime)
	
	DIM dayt AS DateTime
	CLS
	input "Enter the HOUR : ";h%
	dayt.hour=chr$(h%)
	input "Enter the Minutes : ";m%
	dayt.minutes=chr$(m%)
	input "Enter the Seconds : ";s%
	dayt.seconds=chr$(s%)
	input "Enter the Hundredths : ";hd%
	dayt.hundredths=chr$(hd%)
	input "Enter the Month : ";mn%
	dayt.month=chr$(mn%)
	input "Enter the Date  : ";dt%
	dayt.day=chr$(dt%)
	input "Enter the Year  : ";yr%
	dayt.year=yr%
	input "Enter the TimeZone (number of hours from Greenwich Mean Time) : ";tz%
	dayt.timezone=tz%*60%
	
	x=DosSetDateTime%(dayt)
	
	IF (x) THEN
	  Print "An error occurred.  The error number is : ";x
	ELSE
	  print "The system time and date have been reset."
	END IF
	END
