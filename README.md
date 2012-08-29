# cimera - node.js CI bot-thing

cimera is a bot framework to integrate with various communication systems and build backends to allow for a rich experience with your team's workflow and coding system.  It is meant to allow rich notification of events in regard to your project, such as builds being started, their success/failure, being able to kick off automated tests, notifying of actions on the repository, etc.  It is designed to be extensible (my personal workflow uses github whereas my workplace uses hg+fogbugz+kiln) so that different plugins for communications, build systems, bug reporting systems, version control systems, and anything else you can think of, can all be written and integrated into the framework.  It really is just an if-this-then-that system.

## Plugins

I am initially going to write a test plugin to use for unit tests.  This should be just a pretty extensive example of the basic use of a plugin.  Then I plan on writing plugins for XMPP, IRC, GitHub, Kiln/FogBugz, Jenkins, at least these are the pipe dream ones, don't know how long I will last.  Hopefully I will have unit tests for each one, we shall see.

## Status

This is very much a learning project more than designed as heavy production level code.  I have not really done a ton of node stuff, so this will be pretty rough.  Probably a lot of it will be alpha level well into the project, but my first goal is to get this to a dog food state, so IRC, GitHub, and probably TravisCI will be the first things completed.
