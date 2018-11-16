---
layout: post
title: IBM Monochrome Attributes
date: 2018-11-15 10:00:00
permalink: /blog/2018/11/15/
preview: /blog/images/mda-attributes.png
machines:
  - id: ibm5150
    type: pcx86
    config: /devices/pcx86/machine/5150/mda/64kb/debugger/machine.xml
     autoType: |
      $date
      $time
      BASIC
      10 DEFINT A-Z:DEF SEG=&HB000
      20 CLS:V=0
      25 REM FOR EVERY ATTRIBUTE A, DISPLAY THE ATTRIBUTE IN HEX
      30 FOR A=0 TO 255
      35 H=A\16:GOSUB 60:H=A MOD 16:GOSUB 60:H=16:GOSUB 60
      40 IF A MOD 16=15 THEN V=V+64:PRINT
      45 NEXT A
      50 REM NOW OUT &H3B8,&H9 TO DISABLE BLINKING (OR ,&H29 TO ENABLE)
      55 END
      60 REM DISPLAY HEX DIGIT H AT VIDEO ADDRESS V WITH ATTRIBUTE A
      65 IF H<10 THEN H=H+&H30
      70 IF H<16 THEN H=H+&H41-10
      75 IF H=16 THEN H=&H20
      80 POKE V,H:POKE V+1,A:V=V+2
      85 RETURN
---

{% include machine.html id="ibm5150" %}

*[@jeffpar](https://jeffpar.com)*  
*Nov 15, 2018*
