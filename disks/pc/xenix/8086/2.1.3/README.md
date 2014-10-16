Installation Notes
---

Boot from disk "N1" (must not be write-protected).

Serial number: sco005312
activation key: thmjvbqz

Note: this Xenix version can't run with a VGA card.
You can use a Hercules monochrome card or a CGA/EGA card.

Manifest Details
---

[Manifest](manifest.xml) update using:

	find -L private -name "*" -type f -exec node ../../../../../my_modules/diskdump/bin/diskdump --format=json --output=. --manifest --title="SCO Xenix 8086 Operating System v2.1.3" --disk={} \;
