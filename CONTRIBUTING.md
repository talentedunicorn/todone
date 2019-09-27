# Guidelines to contributing to the project

## Code styles

We use [Prettier](https://prettier.io) for formatting code when committing. This is done automatically and requires no action from contributor.

### Naming

- File names are usually lowercase e.g `form.js` and functions use PascalCase i.e. `const Form = () => {...}`
- Styles applied follow the component file name e.g. `form.css`

### Markup

The project attempts to have a [semantic approach](https://developer.mozilla.org/en-US/docs/Glossary/Semantics). When in doubt, some good references can be found at [WHATWG](https://html.spec.whatwg.org/multipage/).
Please try to avoid making everything a `<div>`

### Styles

Current state of the project uses CSS (but there might be a need to move to pre-processors as code grows). Here's a few preferences when adding styles:

- Use [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) whenever introducing reusable values. e.g. colors etc
- Spacing currently uses `rem` values

### Testing

It is prefered if your code contributions include testing. Currently it's not perfect but there is code coverage and tests are using [React Testing Library](https://testing-library.com) and the test runner is [Jest](https://jestjs.io)

## Interactions

> Be nice and reasonable

Basically, no sexism, no racism, no prejudice of any sort. Attempt to be understanding and empathetic and enjoy coding.
Also have a look at our [code of conduct](CODE_OF_CONDUCT.md) document
