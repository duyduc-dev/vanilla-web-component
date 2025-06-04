function styleObjectToCss(styleObj) {
  return Object.entries(styleObj)
    .map(([prop, value]) => {
      const kebabProp = prop.replace(
        /[A-Z]/g,
        (match) => '-' + match.toLowerCase()
      );
      return `${kebabProp}: ${value};`;
    })
    .join(' ');
}

function generateCssFromStyleObject(styleObj, selector = ':host') {
  let css = '';

  // Separate nested selectors from direct styles
  const nestedSelectors = {};
  const directStyles = {};

  for (const [key, value] of Object.entries(styleObj)) {
    if (typeof value === 'object') {
      // nested selector
      nestedSelectors[key] = value;
    } else {
      directStyles[key] = value;
    }
  }

  if (Object.keys(directStyles).length > 0) {
    css += `${selector} { ${styleObjectToCss(directStyles)} }\n`;
  }

  for (const [nestedSelector, nestedStyleObj] of Object.entries(
    nestedSelectors
  )) {
    // Combine :host with nested selector, e.g. ':host input'
    const combinedSelector = `${selector} ${nestedSelector}`;
    css += generateCssFromStyleObject(nestedStyleObj, combinedSelector);
  }

  return css;
}

const resetStyle = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
};

/**
 *
 * @param {BaseComponent} WrappedComponent
 * @param baseStyle
 * @returns {BaseComponent}
 */
const withBaseStyle =
  (baseStyle = {}) =>
  (WrappedComponent, reset = true) => {
    return class extends WrappedComponent {
      constructor(...args) {
        super(...args);
        this.baseStyle = Object.assign({}, reset ? resetStyle : {}, baseStyle);
      }

      onRendered() {
        super.onRendered?.();
        this.applyBaseStyle();
      }

      applyBaseStyle() {
        // Apply direct inline styles on host (only non-nested keys)
        for (const [key, value] of Object.entries(this.baseStyle)) {
          if (typeof value !== 'object') {
            this.style[key] = value;
          }
        }

        if (this.shadowRoot && Object.keys(this.baseStyle).length > 0) {
          const css = generateCssFromStyleObject(this.baseStyle);

          if (!this.shadowRoot.querySelector('style[data-base-style]')) {
            const styleTag = document.createElement('style');
            styleTag.setAttribute('data-base-style', 'true');
            styleTag.textContent = css;
            this.shadowRoot.appendChild(styleTag);
          }
        }
      }
    };
  };

export default withBaseStyle;
