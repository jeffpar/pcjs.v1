---
layout: page
title: "RL01K RSTS/E v7.0 Disk"
permalink: /disks/dec/rl01k/rstsev70/
---

RL01K RSTS/E v7.0 Disk
----------------------

### Boot

To boot the RL01K "RSTS/E v7.0" disk, start a [PDP-11/70](/devices/pdp11/machine/1170/panel/debugger/) with an
[RL11 Disk Controller](/devices/pdp11/rl11/), select the "RSTS/E v7.0" disk from the list of disks
available for drive "RL0", click **Load**, and wait for the message:

	Mounted disk "RSTS/E v7.0" in drive RL0

Then start the machine (click **Run**) and make sure the following prompt has been displayed:

	PDP-11 MONITOR V1.0
	
	BOOT>

At the prompt, type "BOOT RL0".
