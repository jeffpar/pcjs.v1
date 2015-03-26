Git "Cheat Sheet"
===

Committing files
---

To automatically stage files that have been modified and deleted, include -a; eg:

	git commit -a

Creating a new branch ("386dev") after modifying one or more files
---

	git checkout -b 386dev

Pushing a new branch ("386dev")
---

Since a simple `git push` will report:

	fatal: The current branch 386dev has no upstream branch.
    To push the current branch and set the remote as upstream, use
    
        git push --set-upstream origin 386dev

do this instead:

	git push -u origin 386dev

