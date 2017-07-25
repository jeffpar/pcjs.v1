---
layout: page
title: TopView 1.01
permalink: /disks/pcx86/apps/ibm/topview/1.01/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/640kb/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json
      B:
        path: /disks/pcx86/apps/ibm/topview/1.01/TOPVIEW101-PROGRAM.json
    autoScript: startTV
machineScripts:
  startTV: |
    wait Keyboard DOS;
    type Keyboard "$date\r$time\r";
    wait Keyboard;
    sleep 1000;
    select FDC listDrives "A:";
    select FDC listDisks "MS Mouse 5.00 (System)";
    loadDisk FDC;
    wait FDC;
    type Keyboard "MOUSE\r";
    sleep 5000;
    type Keyboard "B:\rTV\r";
---

TopView 1.01
------------

NOTE: Even though we've made every effort to mark all PCjs pages as English, Google's Chrome web browser (v59)
mistakenly thinks this page is in French and will attempt to translate it to English.  That translation process
interferes with elements of the machine; for example, it may change the name of the first diskette drive from
"A:" to "AT:".

So, if you notice any rendering problems, check the top of your web browser, and if you see the message *This page
has been translated from French to English*, click **Show Original**.  Ironically, the addition of these two
paragraphs of English text will likely eliminate the problem.

{% include machine.html id="ibm5160" %}

To manually start TopView: {% include machine-command.html type='button' label='Load' machine='ibm5160' command='startTV' %}

### Directory of TopView 1.01 (Program)

	 Volume in drive A is TV101032885

	Directory of A:\

	TV       PIF     13946 03-28-85  12:00p
	TV       PII      1408 03-28-85  12:00p
	ADD      EXT     16384 03-28-85  12:00p
	ATRIBUTE DEF        32 03-28-85  12:00p
	AUTOPIF            369 03-28-85  12:00p
	CHANGE   EXT     13568 03-28-85  12:00p
	CLOCK    COM      3682 03-28-85  12:00p
	CLOCK    PLB      2071 03-28-85  12:00p
	COLORS   EXT     10752 03-28-85  12:00p
	COLORS   PIF       369 03-28-85  12:00p
	DELETE   EXT      6400 03-28-85  12:00p
	DOS      EXT     39168 03-28-85  12:00p
	DOSHELP  PLB     10237 03-28-85  12:00p
	DW1      TBL        51 03-28-85  12:00p
	DW2      TBL        51 03-28-85  12:00p
	EW       TBL        55 03-28-85  12:00p
	FD       BAT      6163 03-28-85  12:00p
	FDPGM    COM       187 03-28-85  12:00p
	FDR      BAT        46 03-28-85  12:00p
	FILTER   EXT      3905 03-28-85  12:00p
	G        BAT        33 03-28-85  12:00p
	PCW      TBL        55 03-28-85  12:00p
	PDIO     EXT      3072 03-28-85  12:00p
	PDIOKEYB EXT      3072 03-28-85  12:00p
	PDIOMICP EXT      3222 03-28-85  12:00p
	PDIOMICS EXT      3209 03-28-85  12:00p
	PDIOMSY1 EXT      3096 03-28-85  12:00p
	PDIOVIS1 EXT      3214 03-28-85  12:00p
	PE       TBL        44 03-28-85  12:00p
	PROFED   TBL        65 03-28-85  12:00p
	PROGRAMS COM     11520 03-28-85  12:00p
	PROGRAMS HLP      9979 03-28-85  12:00p
	SETSYS   EXT     11008 03-28-85  12:00p
	SETUP    BAT        74 03-28-85  12:00p
	SYSTEM              84 03-28-85  12:00p
	TUTORPIF           369 03-28-85  12:00p
	TV       COM     43264 03-28-85  12:00p
	TV       EXT     49972 03-28-85  12:00p
	WA       TBL        56 03-28-85  12:00p
	WELCOME  EXT      2560 03-28-85  12:00p
	WP       TBL        53 03-28-85  12:00p
	VENDOR-# DO1         0 07-04-83  12:00a
	       42 file(s)     276865 bytes

	Total files listed:
	       42 file(s)     276865 bytes
	                       57344 bytes free

### Directory of TopView 1.01 (Tutorial)

	 Volume in drive A is TUT110784  

	Directory of A:\

	CALC     EXE     56549 11-07-84  12:00p
	CALC     PIF       369 11-07-84  12:00p
	CALC     PLB      5133 11-07-84  12:00p
	ERROR    LIB      8765 11-07-84  12:00p
	GASWAP   BAT       758 11-07-84  12:00p
	INSTRUCT GRA      2540 11-07-84  12:00p
	INSTRUCT WRT      2734 11-07-84  12:00p
	LESSON1  LIB     56019 11-07-84  12:00p
	LESSON2  LIB     10256 11-07-84  12:00p
	LESSON3  LIB     10083 11-07-84  12:00p
	LESSON4  LIB     43072 11-07-84  12:00p
	OCRS     PIF       369 11-07-84  12:00p
	QUD      PNL       121 11-07-84  12:00p
	QUIT     PNL       139 11-07-84  12:00p
	TUTORIAL EXT      6556 11-07-84  12:00p
	TUTORIAL PIF       369 11-07-84  12:00p
	WASWAP   BAT      1190 11-07-84  12:00p
	VENDOR-# DO1         0 07-04-83  12:00a
	       18 file(s)     205022 bytes

	Total files listed:
	       18 file(s)     205022 bytes
	                      146432 bytes free
