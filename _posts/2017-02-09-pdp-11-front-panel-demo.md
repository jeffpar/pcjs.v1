---
layout: post
title: "PDP-11 Operator's Console (Front Panel) Demo"
date: 2017-02-09 15:00:00
permalink: /blog/2017/02/09/
machines:
  - id: test1170
    type: pdp11
    debugger: true
    config: /devices/pdp11/machine/1170/panel/debugger/machine-slim.xml
    sticky: top
---

As I mentioned in the "[PDP-11 Tutorials](http://www.pcjs.org/blog/2017/01/03/)" blog post, I've been working on
some methods for visually illustrating how machine components work.  And the PDP-11/70 Operator's Console,
with its many blinking lights and switches, seemed like a good candidate.

NOTE: I prefer the generic term "Front Panel" to describe DEC's Operator's Console, because it's less ambiguous and
more generally recognized and understood.

I still haven't written a *real* tutorial on the PDP-11/70 Front Panel, which will require starting at a much more
fundamental level, explaining and demonstrating each switch in turn.

However, I have made more progress on the basic elements that any tutorial or demo requires: allowing the user to walk
through a step-by-step demonstration of some procedure.

To illustrate, I've copied a multi-step procedure from the page on [Toggle-Ins](/devices/pdp11/machine/1170/panel/debugger/#toggle-ins)
that shows how to use the PDP-11/70 Front Panel to verify that the Memory Management Unit (MMU) is operating properly.

The procedure involves entering a small 3-instruction program at address 200 that will write a value (070707) to
address 200, executing the program, and then verifying that the MMU relocated that value to address 300 instead.

{% include machine.html id="test1170" %}

Step 1: Load ADDRESS register with 200.

{% include machine-command.html type='clickOnce' label='LOAD 200' machine='test1170' command='script' value='set Panel SR 200; sleep 500; hold Panel LOAD 250' %}

Step 2: Deposit 012737 at ADDRESS 200.

{% include machine-command.html type='clickOnce' label='DEPOSIT 012737' machine='test1170' command='script' value='set Panel SR 012737; sleep 500; hold Panel DEP 250' %}

Step 3: Deposit 000400 at ADDRESS 202.

{% include machine-command.html type='clickOnce' label='DEPOSIT 000400' machine='test1170' command='script' value='set Panel SR 000400; sleep 500; hold Panel DEP 250' %}

Step 4: Deposit 177572 at ADDRESS 204.

{% include machine-command.html type='clickOnce' label='DEPOSIT 177572' machine='test1170' command='script' value='set Panel SR 177572; sleep 500; hold Panel DEP 250' %}

Step 5: Deposit 012737 at ADDRESS 206.

{% include machine-command.html type='clickOnce' label='DEPOSIT 012737' machine='test1170' command='script' value='set Panel SR 012737; sleep 500; hold Panel DEP 250' %}

Step 6: Deposit 070707 at ADDRESS 210.

{% include machine-command.html type='clickOnce' label='DEPOSIT 070707' machine='test1170' command='script' value='set Panel SR 070707; sleep 500; hold Panel DEP 250' %}

Step 7: Deposit 000200 at ADDRESS 212.

{% include machine-command.html type='clickOnce' label='DEPOSIT 000200' machine='test1170' command='script' value='set Panel SR 000200; sleep 500; hold Panel DEP 250' %}

Step 8: Deposit 000000 at ADDRESS 214.

{% include machine-command.html type='clickOnce' label='DEPOSIT 000000' machine='test1170' command='script' value='set Panel SR 000000; sleep 500; hold Panel DEP 250' %}

Step 9: Load ADDRESS register with 300.

{% include machine-command.html type='clickOnce' label='LOAD 300' machine='test1170' command='script' value='set Panel SR 300; sleep 500; hold Panel LOAD 250' %}

Step 10: Deposit 300 at ADDRESS 300.

{% include machine-command.html type='clickOnce' label='DEPOSIT 300' machine='test1170' command='script' value='hold Panel DEP 250' %}

Step 11: Load ADDRESS register with 17772300.

{% include machine-command.html type='clickOnce' label='LOAD 17772300' machine='test1170' command='script' value='set Panel SR 17772300; sleep 500; hold Panel LOAD 250' %}

Step 12: Deposit 077406 at ADDRESS 17772300.

{% include machine-command.html type='clickOnce' label='DEPOSIT 077406' machine='test1170' command='script' value='set Panel SR 077406; sleep 500; hold Panel DEP 250' %}

Step 13: Load ADDRESS register with 17772340.

{% include machine-command.html type='clickOnce' label='LOAD 17772340' machine='test1170' command='script' value='set Panel SR 17772340; sleep 500; hold Panel LOAD 250' %}

Step 14: Deposit 000001 at ADDRESS 17772340.

{% include machine-command.html type='clickOnce' label='DEPOSIT 000001' machine='test1170' command='script' value='set Panel SR 000001; sleep 500; hold Panel DEP 250' %}

Step 15: Load ADDRESS register with 200.

{% include machine-command.html type='clickOnce' label='LOAD 200' machine='test1170' command='script' value='set Panel SR 200; sleep 500; hold Panel LOAD 250' %}

Step 16: Set ENABLE and toggle START.

{% include machine-command.html type='clickOnce' label='START' machine='test1170' command='script' value='set Panel ENABLE 1; sleep 500; hold Panel START 250' %}

Step 17: Load ADDRESS register with 300.

{% include machine-command.html type='clickOnce' label='LOAD 300' machine='test1170' command='script' value='set Panel SR 300; sleep 500; hold Panel LOAD 250' %}

Step 18: Examine ADDRESS 300.

{% include machine-command.html type='clickOnce' label='EXAM' machine='test1170' command='script' value='hold Panel EXAM 250' %}

At this point, the DATA register should display `070707`.  You can also use the PCjs Debugger's `rm` command to verify
the contents of DATA register (DR), or to dump memory location 300 directly (`dw 300 l1`).

*[@jeffpar](http://twitter.com/jeffpar)*  
*Feb 9, 2017*
