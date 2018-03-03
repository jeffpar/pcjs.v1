---
layout: page
title: "IBM PC (Model 5150) running IBM PC Diagnostics 2.07"
permalink: /disks/pcx86/diags/ibm/5150/2.07/
machines:
  - id: ibm5150
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5150/cga/64kb/debugger/machine.xml
    autoMount:
      A:
        name: IBM PC Diagnostics 2.07
---

IBM PC Diagnostics 2.07
-----------------------

This disk displays the following startup messages:

    The IBM Personal Computer DIAGNOSTICS                                           
    Version 2.07 (C)Copyright IBM Corp 1981, 1983                                   
                                                                                    
    SELECT AN OPTION                                                                
                                                                                    
    0 - RUN DIAGNOSTIC ROUTINES                                                     
    1 - FORMAT DISKETTE                                                             
    2 - COPY DISKETTE                                                               
    3 - PREPARE SYSTEM FOR RELOCATION                                               
    9 - EXIT TO SYSTEM DISKETTE                                                     
                                                                                    
    ENTER THE ACTION DESIRED                                                        

{% include machine.html id="ibm5150" %}
