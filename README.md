# Dynamic Frame Web Component

A web component for dynamically loading hypermedia content into an element.

Inspired by [htmx](https://htmx.org) and [Hypermedia Systems](https://hypermedia.systems), this takes a slightly different approach by introducing a web-component instead of adding attributes to standard elements.

Not disimilar to the concept of [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), but with a radically different implementation, the data frame components allow you to load content dynamically with [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) and without creating separate browsing contexts.

Data frames work with forms, and anchors, enabling automatic updates as needed. The project also supports browser history, optional initial content retention, and targeted frame updates from anywhere on the page.

## Usage

Include the [data-frame.js](static/data-frame.js) script on your page.

Add a `data-frame` component:

```html
* <data-frame>
 *   Hello <a href="/world">world</a>
 * </data-frame>
```

When the user clicks the link, the response will load in the data frame.

Supported attributes:

- `src` — Load content initially from a URL.
- `push` — Navigation will push to browser history and URL.
- `default` — If true, all supported elements will target this frame.

## Development setup

1. Clone the repository
2. Install the required Python dependencies from the provided `requirements.txt` file.
3. Run the sample flask app `python app.py` for testing.
