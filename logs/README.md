Logs
---
This is where Node website activity is logged, and where per-user data is stored (temporarily).

Copies of the remote AWS server logs are saved here as well, whenever you run [awsget.sh](../bin/awsget.sh)
or [awspush.sh](../bin/awspush.sh).  See the [Bin](../bin/) directory for details.

Also, to minimize the number of random root directories, I've moved all the per-user data into this folder
as well.  [users.log]() contains all the user IDs that are allowed to have per-user machine states and disk
images on the server.

Per-user support is still in the experimental phase, and security is woefully inadequate.  At the very least,
every user should also have a "secret key" (the hash of which would also be stored in users.log), not to mention
login and logout pages, key request and recovery pages, https support, and so on.  That's an entire infrastructure
I'm not interested in supporting yet, so for now, the integrity of per-user support relies on the use of
obscure user IDs, and the users of those IDs avoiding open, unencrypted networks.

Storing user data on the same server as the web server is also temporary, because this (or any other folder)
can be completely wiped out every time a new version is pushed to AWS.  So we will need a completely different
strategy for preserving per-user data.
