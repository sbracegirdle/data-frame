/**
 * Represents a `data-frame` web component that enables dynamic content loading within a designated frame on the web page.
 * The component serves as a lightweight and flexible alternative to traditional iframes, supporting seamless integration with the surrounding content.
 *
 * Key Features:
 * - **Source Attribute**: The `src` attribute allows specifying a URL to fetch content from, loading it directly within the frame.
 * - **History Navigation Support**: With the optional `push` attribute, the component integrates with browser history, enabling forward and backward navigation.
 * - **Frame-only Requests**: By using a custom header, `X-Frame-Request`, the component can request frame-specific content from the server, potentially reducing unnecessary layout data.
 * - **Initial Content Support**: The component supports defining initial content that gets retained in the browsing history if no `src` is provided initially.
 *
 * Typical use cases include dynamically updating portions of a web page, such as a product description, comments section, or user profile, without requiring a full page reload.
 * It is particularly useful in single-page applications (SPAs) and sites where maintaining a seamless user experience is crucial.
 *
 * Example Usage:
 * ```html
 * <data-frame src="/path/to/content" push="true">
 *   <!-- Content will be loaded here -->
 * </data-frame>
 * ```
 *
 * @extends HTMLElement
 */
class DataFrame extends HTMLElement {
  constructor() {
    super();
    this._src = null;
    this._historyEnabled = false;
  }

  connectedCallback() {
    this._src = this.getAttribute("src");
    this._isDefault =
      this.hasAttribute("default") && this.getAttribute("default") === "true";
    this._historyEnabled =
      this.hasAttribute("push") && this.getAttribute("push") === "true";
    this._loadContent();
    this._observeInteractions();

    if (this._historyEnabled) {
      window.addEventListener("popstate", this._handlePopState.bind(this));
    }
  }

  disconnectedCallback() {
    if (this._historyEnabled) {
      window.removeEventListener("popstate", this._handlePopState.bind(this));
    }

    this._observer.disconnect();
  }

  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" && oldValue !== newValue) {
      this._src = newValue;
      this._loadContent();
    }
  }

  _loadContent(method) {
    if (this._src) {
      fetch(this._src, {
        method: method || "GET",
        headers: {
          "X-Frame-Request": "true",
        },
      })
        .then((response) => response.text())
        .then((data) => {
          // Push src change to attribute
          this.innerHTML = data;
          if (this._historyEnabled) {
            history.pushState(
              { src: this._src, content: this.innerHTML },
              "",
              this._src
            );
          }
        });
    }
  }

  _handlePopState(event) {
    console.log(event);
    if (event.state) {
      this._src = event.state.src || null;
      this.innerHTML = event.state.content || this._initialContent;
    } else {
      // Otherwise take src from base path
      this._src = window.location.pathname;
    }

    // if no content, load it
    if (!this.innerHTML) this._loadContent();
  }

  _observeInteractions() {
    // Handle interactions within the frame
    this.addEventListener("click", this._handleInteraction.bind(this));
    this.addEventListener("submit", this._handleInteraction.bind(this));

    // Handle interactions targeting this frame from elsewhere on the page
    // when the frame is the default frame
    if (this._isDefault) {
      document.addEventListener("click", this._handleInteraction.bind(this));
      document.addEventListener("submit", this._handleInteraction.bind(this));
    }
  }

  _handleInteraction(event) {
    const tagName = event.target.tagName;

    if (tagName !== "A" && tagName !== "FORM") return;

    event.stopPropagation();
    event.preventDefault();

    const attribute = tagName === "A" ? "href" : "action";
    const target = event.target;
    this._src = target.getAttribute(attribute);
    // form defaults to POST
    const method =
      target.getAttribute("method") || tagName === "FORM" ? "POST" : "GET";

    console.log(this._src, method);
    this._loadContent(method);
  }
}

customElements.define("data-frame", DataFrame);
