[![Stories in Ready](https://badge.waffle.io/webize/twtxt.png?label=ready&title=Ready)](https://waffle.io/webize/twtxt)

**twtxt** is a decentralised, minimalist microblogging service for hackers.

So you want to get some thoughts out on the internet? In a convenient and slick way? While also following the gibberish of others? Instead of signing up at a closed and/or regulated microblogging platform, getting your status updates out with twtxt is as easy as putting them in a publicly accessible text file. The URL pointing to this file is your identity, your account. twtxt than can tracks those text files, like a feedreader, and build your unique timeline out of them, depending on which files you track. The format is simple, human readable, and goes well together with all those beloved UNIX command line utilities.

|demo|

**tl;dr**: twtxt is a CLI tool, as well as a format specification for self-hosted flat file based microblogging.

------------------------------------------------------------------------

------------------------------------------------------------------------

Features
========

-   A beautiful command-line interface thanks to click.
-   Asynchronous HTTP requests thanks to asyncio/aiohttp and Python 3.
-   Integrates well with existing tools (scp, cut, echo, date, etc.) and your shell.
-   Don’t like the official client? Tweet using `` echo -e "`date -Im`\tHello world!" >> twtxt.txt ``!

Installation
============

Release version:
----------------

1.  Make sure that you have the latest node / npm
2.  You than can install this package simply via npm:

``` sourceCode
$ npm install twtxt
```

1.  Now run `twtxt quickstart`. :)

Usage
=====

twtxt features an excellent command-line interface thanks to [click]. Don’t hesitate to append `--help` or call commands without arguments to get information about all available commands, options and arguments.

Here are a few of the most common operations you may encounter when using twtxt:

Follow a source:
----------------

``` sourceCode
$ twtxt follow bob http://bobsplace.xyz/twtxt.ttl#me
✓ You’re now following bob.
```

List all sources you’re following:
----------------------------------

``` sourceCode
$ twtxt following
➤ alice @ https://example.org/alice.ttl#me
➤ bob @ http://bobsplace.xyz/twtxt.ttl#me
```

Unfollow a source:
------------------

``` sourceCode
$ twtxt unfollow bob
✓ You’ve unfollowed bob.
```

Post a status update:
---------------------

``` sourceCode
$ twtxt tweet "Hello, this is twtxt!"
```

View your timeline:
-------------------

``` sourceCode
$ twtxt timeline

➤ bob (5 minutes ago):
This is my first "tweet". :)

➤ alice (2 hours ago):
I wonder if this is a thing?
```

Configuration
=============

twtxt uses a simple INI-like configuration file. It’s recommended to use `twtxt quickstart` to create it. On Linux twtxt checks `~/.config/twtxt/config` for it’s configuration. Consult [get\_app\_dir] to fi

  [click]: http://click.pocoo.org/
  [get\_app\_dir]: http://click.pocoo.org/6/api/#click.get_app_dir
