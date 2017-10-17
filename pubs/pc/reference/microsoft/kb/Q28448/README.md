---
layout: page
title: "Q28448: Example Calling OS/2 DosFindFirst, DosFindNext, DosFindClose"
permalink: /pubs/pc/reference/microsoft/kb/Q28448/
---

## Q28448: Example Calling OS/2 DosFindFirst, DosFindNext, DosFindClose

	Article: Q28448
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is an example of calling OS/2 DosFindFirst, DosFindNext, and
	DosFindClose.
	
	'Declarations found in file BSEDOSFL.BI
	'Compiler options: /D/W (/V requires modifications to the code)
	CONST TRUE=-1
	CONST FALSE=0
	
	TYPE FILEFINDBUF
	        fdateCreation  AS INTEGER
	        ftimeCreation  AS INTEGER
	        fdateLastAccess AS INTEGER
	        ftimeLastAccess AS INTEGER
	        fdateLastWrite AS INTEGER
	        ftimeLastWrite AS INTEGER
	        cbFile         AS LONG
	        cbFileAlloc    AS LONG
	        attrFile       AS INTEGER
	        cchName        AS STRING * 1
	        achName        AS STRING * 13
	END TYPE
	
	DECLARE FUNCTION DosFindFirst%( _
	        BYVAL P1s AS INTEGER,_
	        BYVAL P1o AS INTEGER,_
	        SEG   P2 AS INTEGER,_
	        BYVAL P3 AS INTEGER,_
	        SEG   P4 AS FILEFINDBUF,_
	        BYVAL P5 AS INTEGER,_
	        SEG   P6 AS INTEGER,_
	        BYVAL P7 AS LONG)
	
	DECLARE FUNCTION DosFindNext%( _
	        BYVAL P1 AS INTEGER,_
	        SEG   P2 AS FILEFINDBUF,_
	        BYVAL P3 AS INTEGER,_
	        SEG   P4 AS INTEGER)
	
	DECLARE FUNCTION DosFindClose%( _
	        BYVAL P1 AS INTEGER)
	
	'Routines to print Date/Time and File Type
	
	DECLARE FUNCTION wdate$(p1 as integer)
	DECLARE FUNCTION wtime$(p1 as integer)
	DECLARE FUNCTION RightShift%(P1 as LONG,P2 as Integer)
	DECLARE FUNCTION LeftShift%(P1 as LONG, P2 as Integer)
	DECLARE FUNCTION FileType$(P1 as Integer)
	
	DEFINT a-z
	
	COLOR 15,1
	DIM buffer AS FileFindBuf
	DIM filelist(255) as FileFindBuf
	DIM reserved  AS LONG
	
	CLS
	print "Test of DOSFINDFIRST..."
	
	INPUT "Enter the Filename(s) : ";flname$
	flname$=flname$+chr$(0)
	
	atr= 0+2+4+16    'normal + hidden + system + subdirectory
	dirh=1
	searchcount=1
	bufflen=36
	
	x=DosFindFirst%(varseg(flname$),sadd(flname$),_
	                dirh,atr,buffer,bufflen,searchcount,reserved)
	IF (X=0) THEN
	   DO
	     counter=counter+1
	     filelist(counter)=buffer
	     buffer.achname=string$(13,32)  'assign blanks
	     buffer.fdatelastwrite=0
	     buffer.ftimelastwrite=0
	   LOOP WHILE (DosFindNext%(dirh,buffer,bufflen,searchcount) = 0 )
	ELSE
	    PRINT "No MATCH was found"
	    END
	END IF
	CLS
	
	print  "FILENAME : "; : LOCATE 1,30 : PRINT "FILE SIZE : ";
	locate 2,1 : PRINT "LAST WRITE DATE : ";
	locate 3,1 : PRINT "LAST WRITE TIME : ";
	locate 4,1 : PRINT "FILE TYPE : ";
	COLOR 5
	
	i = 1
	
	done=FALSE
	
	key 15, chr$(&h00)+chr$(&h01) 'ESC KEY to EXIT
	on key (15) gosub FINISH
	on key (11) gosub UP
	on key (14) gosub DOWN
	key (15) on
	key (11) on
	key (14) on
	
	locate 20,1 : Print "Enter ESC to quit, UP/DOWN ARROWS to scroll list";
	
	while (not DONE)
	lp:
	 LOCATE 1,14 : PRINT filelist(i).achname;
	 LOCATE 1,45 : PRINT filelist(i).cbfile;"/";filelist(i).cbfilealloc;"       "
	 LOCATE 2,20 : PRINT wdate$(filelist(i).fdatelastwrite);"        ";
	 LOCATE 3,20 : PRINT wtime$(filelist(i).ftimelastwrite);"        ";
	 LOCATE 4,15 : PRINT filetype$(filelist(i).attrfile);"       ";
	 a$=inkey$
	 if a$="" then goto lp
	wend
	
	color 15
	x=DosFindClose%(dirh)
	IF (x) THEN
	  color 7 : PRINT "An error occurred. The number is : ";x : color 15
	ELSE
	  color ,0
	  cls
	END IF
	END
	STOP
	
	FINISH:
	   DONE = TRUE
	   RETURN
	   STOP
	UP:
	   IF i = 1 THEN
	      locate 24,1
	      color 7
	      print "At the top of the list                       ";
	      color 5
	   ELSE
	      locate 24,1 : print string$(78,32);
	      i = i - 1
	   END IF
	   RETURN
	   STOP
	DOWN:
	   IF i = counter THEN
	      locate 24,1
	      color 7
	      Print "At the bottom of the list                  ";
	      color 5
	   ELSE
	      i = i + 1
	      locate 24,1 : print string$(78,32);
	   END IF
	   RETURN
	   STOP
	
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
	
	FUNCTION FileType$(attr)
	  SELECT CASE attr
	     CASE 0
	        FileType$="Normal File"
	     CASE 1
	        FileType$="Read-Only File"
	     CASE 2
	        FileType$="Hidden File"
	     CASE 4
	        FileType$="System File"
	     CASE &h10
	        FileType$="Subdirectory"
	     CASE &h20
	        FileType$="File Archive"
	     CASE ELSE
	        FileType$="Unknown Type"
	  END SELECT
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
