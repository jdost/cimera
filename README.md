# cimera - node.js CI bot-thing

cimera is a bot framework to integrate with various communication systems and build backends to allow for a rich experience with your team's workflow and coding system.  It is meant to allow rich notification of events in regard to your project, such as builds being started, their success/failure, being able to kick off automated tests, notifying of actions on the repository, etc.  It is designed to be extensible (my personal workflow uses github whereas my workplace uses hg+fogbugz+kiln) so that different plugins for communications, build systems, bug reporting systems, version control systems, and anything else you can think of, can all be written and integrated into the framework.  It really is just an if-this-then-that system.

## Plugins

There are a few types of plugins, there are communication plugins (things like IRC, XMPP, email), versioning plugins (listen to systems for git, mercurial, and svn, as well as services like github, bitbucket, etc.), and integration plugins (stuff that acts on the code, running test suites, builds, deploys).  There are going to be a sample plugin for each type.  There are also going to be basic generic plugins, things like a logger and web API.

## Status

A lot of this is being fleshed out still.  The logger has been written, as well as a form of the basic boot up system.  Fake versions of the 3 basic types (VCS, Comm, and CI/Builder) are next, as this will allow for the basic interaction to be fleshed out better.  These will act on the basic interface (plugins can enrich the interface as desired).
