---
layout: page
title: "Q52093: BASIC 7.00 Example to Find All Available Disk Drives"
permalink: /pubs/pc/reference/microsoft/kb/Q52093/
---

## Q52093: BASIC 7.00 Example to Find All Available Disk Drives

	Article: Q52093
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891214-80
	Last Modified: 14-JAN-1990
	
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 can change the current drive from within a BASIC
	program with the command
	
	   CHDRIVE <drive letter>
	
	where <drive letter> is a string expression that is a valid drive.
	This statement, coupled with error trapping, can be used to find all
	available disk drives.
	
	The example program below collects a list of all the available disk
	drives and puts it into the fixed-length STRING array "Drives". This
	is done by using the CHDRIVE statement to log onto each possible drive
	(A through Z) and adding to the list only those drives that were
	successfully logged onto.
	
	The INTEGER variable "IsDrive%" is used to flag whether or not the
	CHDRIVE statement was successful in trying to log onto the next drive.
	
	If CHDRIVE is unsuccessful, BASIC will generate a "Device unavailable"
	error. This error will be trapped by the local error-handling routine,
	"DriveError", which will set "IsDrive%" to FALSE.
	
	If CHDRIVE is successful, "IsDrive%" will remain TRUE and the drive
	will be added to the list. The total number of available drives is
	stored in the INTEGER variable "TotalDrives%".
	
	Note that on a PC a legal drive name can only be a single letter
	between  "A" and "Z". Also, DOS does not distinguish between uppercase
	and lowercase letters. Therefore, in the following program we can use
	the numbers 65 through 90 whose corresponding ASCII characters are "A"
	through "Z" to circulate through all the possible drives. The counter
	variable of a FOR...NEXT loop is just right for performing this task.
	Our counter is "DriveLetter%".
	
	Code Example
	------------
	
	CONST TRUE = -1
	CONST FALSE = 0
	
	DIM Drives(26) AS STRING * 1       'The list of drives.
	
	ON LOCAL ERROR GOTO DriveError   'If CHDRIVE unsuccessful trap error.
	TotalDrives% = 0
	
	FOR DriveLetter% = 65 TO 90      'ASCII "A" through "Z"
	   IsDrive% = TRUE
	   CHDRIVE CHR$(DriveLetter%)   'Try to log onto drive.
	   IF IsDrive% THEN
	      TotalDrives% = TotalDrives% + 1   'CHDRIVE was successful.
	      Drives(TotalDrives%) = CHR$(DriveLetter%)   'Add drive letter.
	   END IF
	NEXT DriveLetter%
	
	END
	
	DriveError: IsDrive% = FALSE   'CHDRIVE was unsuccessful.
	            RESUME NEXT        'Resume at the IF statement.
