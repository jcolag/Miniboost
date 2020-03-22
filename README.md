# Miniboost
A lightweight note-editor compatible with Boost Note

I *really* like [Boost Note](https://boostnote.io/) and have been happily using it for years.  However, my laptop is getting a little bit long in the tooth and yet another Electron app is a bit much to run at all times.  And if note-taking software isn't available at all times, it's unfortunately not very useful.

Thankfully, Boost Note is open source and its file formats are straightforward.  And since [Proton Native](https://proton-native.js.org/)'s current iteration is relatively solid, I was able to put together a user interface that's compatible with my existing notes with much less overhead.

This is *not*, however, a replacement for Boost Note; think of it more as a supplement for it, a minimal tool that can handle the easy work if you already use Boost Note, but not the bigger tasks.

I may improve on it later, but currently, **Miniboost** only allows the user to select a category, select a note, and read/edit the markdown; alternatively, after a category has been selected, it's possible to create a new note.  For the latter case, I have *tried* to make sure the titles and timestamps are set correctly, but all of the other features and conveniences that Boost Note provides are unavailable here.

The odds that this will be useful to anybody else seems low---especially since Proton Native's text editor doesn't seem to be able to handle word wrap---and this was designed around my usual workflow, but if anybody has any improvements, by all means, get involved!

As a small concession to usability for people who aren't me, if you don't like the white-on-black color scheme (I don't, either, but it's readable at night without being glaring, and that's all I want), you can create a `~/.config/Miniboost.json` file that specifies a new color scheme.  It looks something like this.

```json
{
  "backgroundColor": "black",
  "foregroundColor": "white"
}
```

I may eventually add new options (font size might be useful) and wouldn't be averse to a pull request with anything interesting.

