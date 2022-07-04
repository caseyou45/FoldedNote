# FoldedNote
Here you’ll find the Node.js backend and React fronted for Folded Note. 

This website uses Draft.js to allow users to create rich text notes. When a user visits the website, a unique identifier is created and then appended to the url. The note is automatically saved in MongoDB. The note can be accessed again on any device with that url.  

With the rich text functionality, a user can write anything as if they were using a trimmed-down word processor (minus spell checking). Typing will automatically save the note. 

There is also a layer of security without the need for a username or email. If a user sets a password on the note, in order to visit the note again, all they need to do is enter the password once they have navigated to their note using the base url + the unique identifier. Essentially, security is handled in this sense by obscurity (someone would have to either know your identifier or make a fantastic guess) and through the password, which has an eight-character minimum. A mistyped identifier or a failed guess, whichever the case may be, will create a new blank note.  
