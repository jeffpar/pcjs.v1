---
layout: page
title: MicroPro WordStar 3.24
permalink: /disks/pcx86/apps/other/wordstar/3.24/
machines:
  - id: ibm5150
    type: pcx86
    config: /devices/pcx86/machine/5150/mda/256kb/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json
      B:
        path: /disks/pcx86/apps/other/wordstar/3.24/WS324-MOUNTABLE.json
    autoType: $date\r$time\rB:\rWS\r
  - id: scrollLEDs
    type: leds
    name: LED Scroller
    config: |
      {
        "scrollLEDs": {
          "class": "Machine",
          "type": "leds",
          "name": "LED Scroller",
          "version": 1.11,
          "autoPower": true,
          "autoRestore": false,
          "overrides": ["autoPower","autoRestore"]
        },
        "scrollChip": {
          "class": "Chip",
          "rule": "L1",
          "message": "Happy New Year!$c$30b$30o$30b$30o$90s",
          "overrides": ["message"]
        },
        "scrollClock": {
          "class": "Time",
          "cyclesPerSecond": 60,
          "cyclesMinimum": 1,
          "cyclesMaximum": 120,
          "clockByFrame": true,
          "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate","cyclesMinimum","cyclesMaximum","requestAnimationFrame"]
        },
        "scrollDisplay": {
          "class": "LED",
          "type": 0,
          "cols": 256,
          "rows": 16,
          "colsExtra": 16,
          "color": "red",
          "backgroundColor": "black",
          "highlight": false,
          "bindings": {
            "container": "displayScroll"
          },
          "overrides": ["color","backgroundColor"]
        },
        "scrollInput": {
          "class": "Input",
          "drag": true
        }
      }
styles:
  scrollLEDs:
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 32px;
    margin-bottom: 16px;
  displayScroll:
    position: relative;
---

MicroPro WordStar 3.24
----------------------

{% include machine.html id="scrollLEDs" config="json" %}

<div id="scrollLEDs"><div id="displayScroll"></div></div>

A [Directory Listing](#directory-of-wordstar-324) of the single-sided (160Kb) WordStar 3.24 diskette from the PCjs Archives
is provided below.

We've also archived the article "[WordStar 3.24 and 3.3: MicroPro Does It Again... And Again](../#pc-magazine-review)",
an interesting review/rant from 1983 on this and other versions of WordStar for the IBM PC.  It includes a number of useful patches and tips.

{% include machine.html id="ibm5150" %}

### Directory of WordStar 3.24

	 Volume in drive A has no label
	 Directory of A:\

	WSOVLY1  OVR     41216 11-15-82  12:00a
	WSMSGS   OVR     28160 11-15-82  12:00a
	INSTALL  BAS     17152 10-01-82  12:00a
	PRINT    TST      3968 01-01-80  12:00a
	WS       COM     20864 02-01-83  12:00a
	        5 file(s)     111360 bytes
	                       48128 bytes free
