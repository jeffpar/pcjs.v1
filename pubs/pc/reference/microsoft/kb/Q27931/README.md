---
layout: page
title: "Q27931: Sample Program That Makes OS/2 Call DosGetDateTime"
permalink: /pubs/pc/reference/microsoft/kb/Q27931/
---

## Q27931: Sample Program That Makes OS/2 Call DosGetDateTime

	Article: Q27931
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that CALLs the OS/2 routine DosGetDateTime.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	' The user-defined TYPE and function DECLARE are found in
	' BSEDOSPE.BI
	
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
	
	DECLARE FUNCTION DosGetDateTime%(SEG P1 AS DateTime)
	DECLARE FUNCTION FDAY$ (x%)
	
	DIM dayt AS DateTime
	CLS
	x=DosGetDateTime%(dayt)
	
	IF (x) THEN
	  Print "An error occurred.  The error number is : ";x
	ELSE
	  t$=str$(asc(dayt.hour))+":"+str$(asc(dayt.minutes))+":"_
	     +str$(asc(dayt.seconds))  +":"+str$(asc(dayt.hundredths))
	
	  d$=str$(asc(dayt.month))+"/"+right$(str$(asc(dayt.day)),2)_
	      +"/"+right$(str$(dayt.year),4)
	
	  Print "TIME : ";t$
	  Print "DATE : ";d$
	  print "Number of hours from Greenwich Mean Time : ";(dayt.timezone)/60%
	  print "The day of the week : "; fday$(asc(dayt.dayofweek))
	END IF
	end
	
	FUNCTION FDAY$(x%) STATIC
	
	SELECT CASE x%
	   case 0
	       fday$="Sunday"
	   case 1
	       fday$="Monday"
	   case 2
	       fday$="Tuesday"
	   case 3
	       fday$="Wednesday"
	   case 4
	       fday$="Thursday"
	   case 5
	       fday$="Friday"
	   case 6
	       fday$="Saturday"
	   case else
	       fday$="XXXXXXXXX"
	  END SELECT
	END FUNCTION
