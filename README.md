# Miniboost

A lightweight note-editor (mostly) compatible with Boost Note

I *really* like [Boost Note](https://boostnote.io/) and have been happily using it for years.  However, my laptop is getting a little bit long in the tooth and yet another Electron app is a bit much to run at all times.  And if note-taking software isn't available at all times, it's unfortunately not very useful.

Thankfully, Boost Note is open source and its file formats are straightforward.  And since [Proton Native](https://proton-native.js.org/)'s current iteration is relatively solid, I was able to put together a user interface that's compatible with my existing notes with much less overhead.

This is *not*, however, a replacement for Boost Note; think of it more as a supplement for it, a more-minimal tool that can handle the easy work if you already use Boost Note, but not the bigger tasks.

I may improve on it later, but currently, **Miniboost** only allows the user to select a category, select a note, and read/edit the markdown; alternatively, after a category has been selected, it's possible to create a new note.  New categories are also possible.  For new notes, I have *tried* to make sure that the titles and timestamps are set correctly, but most of the other features and conveniences that Boost Note provides are unavailable here.  For example, all notes are Markdown notes; I don't use the code notes, so have no idea what they'd look like.  I don't even want to *guess* what the program would do with those weird tabbed "code notes."

The odds that this will be useful to anybody else seems low---especially since Proton Native's text editor doesn't seem to be able to handle word wrap---and this was designed around my usual workflow, but if anybody has any improvements, by all means, get involved filing issues and pull requests!

As a small concession to usability for people who aren't me, if you don't like the white-on-black color scheme (I don't, either, but it's readable at night without being glaring, and that's all I want) or a few other features, you can create a `~/.config/Miniboost.json` file that specifies a new color scheme.  You can also configure the location for your notes and the interval at which **Miniboost** will monitor the note files for external changes.

A full configuration file looks something like this, but you don't need to include anything you don't want to change.

```json
{
  "autoRefresh": false,
  "backgroundColor": "orange",
  "boostdir": "/home/username/Boostnote",
  "exportStyle": "table { border-collapse: collapse; } td,th { border: 1px solid darkgray; }",
  "fontSize": 12,
  "foregroundColor": "blue",
  "interval": 100,
  "textColor": "green",
}
```

The `autoPreview` flag enables an experimental feature that has the preview page reload in the browser, while adding an option in the user interface to periodically update it.  The `boostdir` directory is the location where you can find your **Boostnote** notes, in case they're not in the default location.  The `exportStyle` is CSS to format notes previewed in the browser.  The `interval` is how often **Miniboost** will check to see if the current note has been modified by another program; a negative number means that it never checks.

Most of the rest should be self-explanatory.  However, note that the text might be shown at different sizes, but those sizes are all based on the size of the editor's text, so that only one size needs to be specified.

Regarding `exportStyle`, you can override the appearance of checkboxes, too, if you don't like the default emoji.  Just override `ul .checked:before` and `ul .unchecked:before` with whatever list bullet styles that you happen to prefer.

