Git "Cheat Sheet"
===

Committing files
---

To automatically stage files that have been modified and deleted, include -a; eg:

	git commit -a

Creating a new branch ("386dev")
---

You could use `git branch`, but if you've already modified some files that you now want to 
move to a new branch:

	git checkout -b 386dev
	
Pushing a new branch ("386dev")
---

Since a simple `git push` will report:

	fatal: The current branch 386dev has no upstream branch.
    To push the current branch and set the remote as upstream, use
    
        git push --set-upstream origin 386dev

do this instead:

	git push -u origin 386dev

Reverting (resetting) a single file [[link](http://www.norbauer.com/rails-consulting/notes/git-revert-reset-a-single-file.html)]
---

If you have an uncommitted change (it's only in your working copy) that you wish to revert (in SVN terms)
to the copy in your latest commit, do the following:

	git checkout filename

This will checkout the file from HEAD, overwriting your change. This command is also used to checkout branches,
and you could happen to have a file with the same name as a branch. All is not lost, you will simply need to type:

	git checkout -- filename

You can also do this with files from other branches, and such. `man git-checkout` has the details.

The rest of the Internet will tell you to use `git reset --hard`, but this resets all uncommitted changes you’ve
made in your working copy. Type this with care.
