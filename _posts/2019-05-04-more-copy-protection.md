---
layout: post
title: More Copy Protection
date: 2019-05-05 10:00:00
permalink: /blog/2019/05/05/
preview: /blog/images/dbase-iii-disk-image.png
---

BREAKING NEWS: An unmodified, copy-protected version of [dBASE III](/disks/pcx86/apps/other/dbase3/1.0/)
now runs on PCjs!

Actually, this isn't that newsworthy, because at least one other emulator already
[accomplished](https://forum.winworldpc.com/discussion/9472/software-spotlight-dbase-iii-r1-0)
that feat.  And I had already [debugged](/pubs/docs/personal/1984-09-16--DBASE_III_DEBUG.pdf)
and [defeated](/pubs/docs/personal/1984-09-25--DBASE_III_PATCH.pdf) dBASE III copy-protection
almost 35 years ago (see the [PCjs Personal Document Collection](/docs/personal/) for more tidbits).

However, something that seems to be missing from both contemporary and modern reports is any explanation
of how this particular copy-protection scheme worked, and how feasible it might be to duplicate using
modern hardware.

### Meet PROLok

Ashton-Tate, the maker of dBASE III, used a copy-protection scheme developed by Vault Corporation called
PROLok, which reportedly involved using a laser to burn a small "hole" into a predetermined area of the disk,
and then incorporating code into the application which would analyze the sector containing that hole.  If the
analysis failed, the application would report:

    Unauthorized Duplicate

and terminate.  In the Kryoflux visualization below, this "hole" appears on **dBASE III 1.0 (Disk 1)**
on track 39, sector 5 -- the orange arc immediately to the left of the two red rings.

![dBASE III 1.0](/blog/images/dbase-iii-disk-image.png)

Press reports at the time were slightly exagerrated, as there was no actual "hole".  A laser may have
been used, but only to *damage* -- not puncture -- a single sector on one side of the disk.  Moreoever, the
damage had to occur somewhere in the middle of the target sector, allowing a certain number of bytes to
still be written to the beginning of the damaged sector.

With that in mind, here was the basic logic of the copy-protection test:

- Read the damaged sector
- Verify that the read operation reports a CRC error
- Write *new* data to the damaged sector
- Re-read the damaged sector
- Verify that the read operation returns *some* of the new data

Since the first part of the sector is undamaged, a certain number of bytes should contain new data after
the write.  The PROLok code knows where the damaged area begins (within +/-10 bytes), so after it performs that
last read, it expects to see new data *only* up to that point.

### Duplicating PROLok

For an emulator, duplicating such an error is fairly straightforward, and in PCjs, it's almost trivial.
All I had to do was add a new *dataError* property to the damaged sector of the JSON-encoded disk image.  The
value of this new property specifies the maximum number of bytes that can be written; any bytes written
beyond that point are now ignored by the PCjs [Floppy Disk Controller](/modules/pcx86/lib/fdc.js).

This mimics what happens with a real PROLok disk.  For example, some 200+ bytes may be successfully written
to a damaged 512-byte sector, and those 200+ bytes will be returned on a subsequent read, but the rest of the bytes
are unmodifiable and invalid, so they will never change, and they will always trigger a CRC error as well.

Duplicating this kind of error on another physical disk seems very problematic.  Without disk duplication hardware
that can somehow create the same kind of "damage" in the middle of a sector, it's hard to see how another working
physical copy of the disk could be made.

From a software preservation standpoint, it might be sufficient to simply duplicate all the undamaged sectors and
call it a day, since there isn't any code or data in the damaged sector that needs to be preserved.  But if the
preservation goal includes being able to *run* the software exactly as it originally existed, on original hardware,
that goal becomes extremely challenging.

In the case of software like dBASE III, our choices appear to be:

- Rely on emulators like PCjs, in conjunction with annotated disk images
- Use [patched binaries](/disks/pcx86/apps/other/dbase3/1.0/#dbase-iii-disk-information)
- Find or build specialized hardware that can recreate specific disk anomalies

*[@jeffpar](https://jeffpar.com)*  
*May 5, 2019*
