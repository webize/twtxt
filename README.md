[![Stories in Ready](https://badge.waffle.io/webize/twtxt.png?label=ready&title=Ready)](https://waffle.io/webize/twtxt)

**twtxt** is a decentralised, minimalist microblogging service for hackers.

So you want to get some thoughts out on the internet? In a convenient and slick way? While also following the gibberish of others? Instead of signing up at a closed and/or regulated microblogging platform, getting your status updates out with twtxt is as easy as putting them in a publicly accessible text file. The URL pointing to this file is your identity, your account. twtxt than can tracks those text files, like a feedreader, and build your unique timeline out of them, depending on which files you track. The format is simple, human readable, and goes well together with all those beloved UNIX command line utilities.

!|demo|(https://asciinema.org/a/1w2q3suhgrzh2hgltddvk9ot4.png "Demo")

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
$ npm install -g twtxt
```

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
-------------
twtxt uses a simple INI-like configuration file. It’s recommended to use ``twtxt quickstart`` to create it. On Linux twtxt checks ``~/.config/twtxt/config`` for it’s configuration. Consult `get_app_dir <http://click.pocoo.org/6/api/#click.get_app_dir>`_ to find out the config directory for other operating systems.

Here’s an example ``conf`` file, showing every currently supported option:

.. code::

    [twtxt]
    nick = buckket
    twtfile = ~/twtxt.txt
    check_following = True
    use_pager = False
    limit_timeline = 20
    timeout = 5.0
    sorting = descending
    post_tweet_hook = "scp {twtfile} buckket@example.org:~/public_html/twtxt.txt"

    [following]
    bob = https://example.org/bob.txt
    alice = https://example.org/alice.txt


[twtxt] section:
================
+-------------------+-------+------------+---------------------------------------------------+
| Option:           | Type: | Default:   | Help:                                             |
+===================+=======+============+===================================================+
| nick              | TEXT  |            | your nick, will be displayed in your timeline     |
+-------------------+-------+------------+---------------------------------------------------+
| twtfile           | PATH  |            | path to your local twtxt file                     |
+-------------------+-------+------------+---------------------------------------------------+
| check_following   | BOOL  | True       | try to resolve URLs when listing followings       |
+-------------------+-------+------------+---------------------------------------------------+
| use_pager         | BOOL  | False      | use a pager (less) to display your timeline       |
+-------------------+-------+------------+---------------------------------------------------+
| limit_timeline    | INT   | 20         | limit amount of tweets shown in your timeline     |
+-------------------+-------+------------+---------------------------------------------------+
| timeout           | FLOAT | 5.0        | maximal time a http request is allowed to take    |
+-------------------+-------+------------+---------------------------------------------------+
| sorting           | TEXT  | descending | sort timeline either descending or ascending      |
+-------------------+-------+------------+---------------------------------------------------+
| post_tweet_hook   | TEXT  |            | command to be executed after tweeting             |
+-------------------+-------+------------+---------------------------------------------------+

``post_tweet_hook`` is very useful if you want to push your twtxt file to a remote (web) server. Check the example above tho see how it’s used with ``scp``.

[followings] section:
=====================
This section holds all your followings as nick, URL pairs. You can edit this section manually or use the ``follow``/``unfollow`` commands of twtxt for greater comfort.

Format specification
--------------------
The central component of sharing information, i.e. status updates, with twtxt is a simple text file containing all the status updates of a single user. One status per line, each of which is equipped with an ISO 8601 date/time string followed by a TAB character (\\t) to separate it from the actual text. A specific ordering of the statuses is not mandatory.

The file must be encoded with UTF-8, and must use LF (\\n) as line separators.

A status should consist of up to 140 characters, longer status updates are technically possible but discouraged. twtxt will warn the user if a newly composed status update exceeds this limit, and it will also shorten incoming status updates by default. Also note that a status may not contain any control characters.

Take a look at this example file:

.. code::

    2016-02-04T13:30+01	You can really go crazy here! ┐(ﾟ∀ﾟ)┌
    2016-02-01T11:00+01	This is just another example.
    2015-12-12T12:00+01	Fiat lux!

Contributions
-------------
- A web-based directory of twtxt users by `reednj <https://twitter.com/reednj>`_: http://twtxt.reednj.com/
- A web-based directory of twtxt users by `xena <https://git.xeserv.us/xena>`_: https://twtxtlist.cf
- A web-based twtxt feed hoster for the masses by `plomlompom <http://www.plomlompom.de/>`_: https://github.com/plomlompom/htwtxt
- A twitter-to-twtxt converter in node.js by `DracoBlue <https://github.com/DracoBlue>`_: https://gist.github.com/DracoBlue/488466eaabbb674c636f

License
-------
twtxt is released under the MIT License. See the bundled LICENSE file for details.
