---
layout: post
title: Revisiting OS/2
date: 2015-12-27 11:00:00
category: OS/2
permalink: /blog/2015/12/27/
machines:
  - type: pc-dbg
    id: ibm5170
    config: /disks/pc/os2/ibm/1.0/machine.xml
---

Just for fun (because I have a warped sense of fun), I decided to revisit some of the old OS/2 software I wrote
almost 30 years ago.  But first, I needed an OS/2 development environment.

So I started with a clean install of IBM's OS/2 1.0 in the [8Mhz IBM PC AT](/disks/pc/os2/ibm/1.0/) machine
below, by booting from the "IBM OS/2 1.0 (1.44M Install)" diskette in drive A and reformatting the machine's 20Mb
drive C.

Next, I installed the [MS OS/2 SDK 1.02](/disks/pc/tools/microsoft/os2/sdk/1.02/).  This SDK was released around
December 1987 and included a copy of Microsoft OS/2 1.0.  I don't have any of the printed documentation that came
with the SDK, such as the *Installation Guide*, but I do have the [Microsoft® Operating System/2 Programmer’s Toolkit](/docs/os2/microsoft/ptk/1.0/)
from March 1988, thanks to the [OS/2 Museum](http://www.os2museum.com/wp/os2-history/os2-library/os2-1-x-programming/).

Aside from Microsoft's assembler (MASM) and C compiler, the SDK included some other useful tools, such as **SDKED**
(SDK Editor), which was essentially an OS/2 port of Mark Zbikowski's **Z** Editor that was used internally at
Microsoft for many years.  The same editor was later renamed to **M** and ultimately **PWB** (Programmer's Workbench).
With the introduction of various Integrated Development Environment (IDE) products, such as Visual BASIC in 1991,
Visual C++ in 1993, and Visual Studio in 1995, this stand-alone editor became obsolete, but in the 1980s, it was a
valuable tool.

You can learn more about [SDKED](/disks/pc/tools/microsoft/os2/sdk/1.02/#using-sdked) on the
[MS OS/2 SDK 1.02](/disks/pc/tools/microsoft/os2/sdk/1.02/) page.  I'll be adding a complete list of all the files
that came with SDK to that page in the near future.

To boot IBM OS/2 1.0 and tinker with the [SDK](/disks/pc/tools/microsoft/os2/sdk/1.02/), scroll down and
click the "Run" button.

{% include machine.html id="ibm5170" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*December 27, 2015*
