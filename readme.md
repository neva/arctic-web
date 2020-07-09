# Arctic

## What is Arctic?
Arctic is a new authentication service that aims to be practical and first of all easy to use.

## Notices
If you catch any errors feel free to write a mail `paul.hanneforth.o@gmail.com` or create an issue on GitHub.

# How to use it?
## Installation
To Install arctic-web, simply add this line of code to your HEAD.
```html
<script src="https://cdn.jsdelivr.net/npm/arcticweb@latest/index.js"></script>
```
It's important to import this script tag before your other scripts otherwise your scripts cannot access `arctic`.
## Authentication
To authenticate a user simply call `arctic.authenticate(app, callback)`, where `app` is your appID and `callback` is the URL the user should be redirected to when he's authenticated. The URL should led to an express app in which [`arctic-node`](https://github.com/neva/arctic-node "Arctic Node") is installed, so that the user information can be parsed