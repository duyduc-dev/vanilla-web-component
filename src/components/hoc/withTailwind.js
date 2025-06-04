const twColors = {
  red: {
    50: '#fff5f5',
    100: '#fed7d7',
    200: '#feb2b2',
    300: '#fc8181',
    400: '#f56565',
    500: '#e53e3e',
    600: '#c53030',
    700: '#9b2c2c',
    800: '#822727',
    900: '#63171b',
  },
  blue: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#2b6cb0',
    700: '#2c5282',
    800: '#2a4365',
    900: '#1A365D',
  },
  green: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#38a169',
    600: '#2f855a',
    700: '#276749',
    800: '#22543d',
    900: '#1C4532',
  },
  yellow: {
    50: '#fffff0',
    100: '#fefcbf',
    200: '#faf089',
    300: '#f6e05e',
    400: '#ecc94b',
    500: '#d69e2e',
    600: '#b7791f',
    700: '#975a16',
    800: '#744210',
    900: '#5F370E',
  },
  gray: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923',
  },
};

const spacingScale = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

const fontSizeMap = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
};

const borderRadiusMap = {
  DEFAULT: '0.25rem',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px',
};

const resolveColor = (path) => path.reduce((obj, key) => obj?.[key], twColors);
const escapeClass = (cls) => cls.replace(/[:\[\]#\.]/g, (m) => '\\' + m);

const parseClass = (cls) => {
  const isHover = cls.startsWith('hover:');
  const baseCls = isHover ? cls.slice(6) : cls;
  const selector = isHover
    ? `.${escapeClass(cls)}:hover`
    : `.${escapeClass(cls)}`;

  const parsers = [
    // Arbitrary values e.g. bg-[#fff000], ml-[20px]
    () => {
      // Match key-[value], where value can contain #, digits, letters, %, px, rem, etc.
      const m = baseCls.match(/^([a-z]+)-\[(.+)\]$/);
      if (m) {
        const propMap = {
          bg: 'background-color',
          text: 'color',
          ml: 'margin-left',
          mr: 'margin-right',
          mt: 'margin-top',
          mb: 'margin-bottom',
          p: 'padding',
          pt: 'padding-top',
          pb: 'padding-bottom',
          pl: 'padding-left',
          pr: 'padding-right',
          w: 'width',
          h: 'height',
          // add more props here if needed
        };
        const prop = propMap[m[1]];
        if (prop) {
          // sanitize value (remove trailing spaces, etc.)
          const val = m[2].trim();
          return `${selector} { ${prop}: ${val}; }`;
        }
      }
    },

    // text-{color}-{shade}
    () => {
      const m = baseCls.match(/^text-(\w+)-(\d{3})$/);
      if (m) {
        const value = resolveColor([m[1], +m[2]]);
        if (value) return `${selector} { color: ${value}; }`;
      }
    },

    // bg-{color}-{shade}
    () => {
      const m = baseCls.match(/^bg-(\w+)-(\d{3})$/);
      if (m) {
        const value = resolveColor([m[1], +m[2]]);
        if (value) return `${selector} { background-color: ${value}; }`;
      }
    },

    // opacity-{n}
    () => {
      const m = baseCls.match(/^opacity-(\d{2,3})$/);
      if (m) return `${selector} { opacity: ${parseInt(m[1]) / 100}; }`;
    },

    // Negative margins support (-ml-4)
    () => {
      const m = baseCls.match(/^-(m|mt|mb|ml|mr|mx|my)-(\d+)$/);
      if (m) {
        const spacingProps = {
          m: 'margin',
          mx: ['margin-left', 'margin-right'],
          my: ['margin-top', 'margin-bottom'],
          mt: 'margin-top',
          mb: 'margin-bottom',
          ml: 'margin-left',
          mr: 'margin-right',
        };
        const props = spacingProps[m[1]];
        const val = spacingScale[m[2]];
        if (!val) return null;
        if (Array.isArray(props)) {
          return `${selector} { ${props
            .map((p) => `${p}: -${val};`)
            .join(' ')} }`;
        }
        return `${selector} { ${props}: -${val}; }`;
      }
    },

    // padding / margin (positive)
    () => {
      const spacingProps = {
        p: 'padding',
        px: ['padding-left', 'padding-right'],
        py: ['padding-top', 'padding-bottom'],
        pt: 'padding-top',
        pb: 'padding-bottom',
        pl: 'padding-left',
        pr: 'padding-right',
        m: 'margin',
        mx: ['margin-left', 'margin-right'],
        my: ['margin-top', 'margin-bottom'],
        mt: 'margin-top',
        mb: 'margin-bottom',
        ml: 'margin-left',
        mr: 'margin-right',
      };
      const m = baseCls.match(
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(\d+)$/,
      );
      if (m) {
        const props = spacingProps[m[1]];
        const val = spacingScale[m[2]];
        if (!val) return null;
        if (Array.isArray(props)) {
          return `${selector} { ${props.map((p) => `${p}: ${val};`).join(' ')} }`;
        }
        return `${selector} { ${props}: ${val}; }`;
      }
    },

    // display property (added back!)
    () => {
      const displayMap = {
        block: 'block',
        'inline-block': 'inline-block',
        inline: 'inline',
        flex: 'flex',
        'inline-flex': 'inline-flex',
        grid: 'grid',
        'inline-grid': 'inline-grid',
        hidden: 'none',
      };
      if (displayMap[baseCls])
        return `${selector} { display: ${displayMap[baseCls]}; }`;
    },

    // text size
    () => {
      const m = baseCls.match(/^text-(sm|base|lg|xl|2xl)$/);
      if (m) return `${selector} { font-size: ${fontSizeMap[m[1]]}; }`;
    },

    // font weight
    () => {
      const m = baseCls.match(/^font-(thin|normal|medium|bold)$/);
      const weights = {
        thin: 100,
        normal: 400,
        medium: 500,
        bold: 700,
      };
      if (m) return `${selector} { font-weight: ${weights[m[1]]}; }`;
    },

    // border radius
    () => {
      const m = baseCls.match(/^rounded(?:-(sm|md|lg|full))?$/);
      if (m) {
        const key = m[1] || 'DEFAULT';
        return `${selector} { border-radius: ${borderRadiusMap[key]}; }`;
      }
    },

    // width / height
    () => {
      const m = baseCls.match(/^(w|h)-(\d+)$/);
      if (m) {
        const prop = m[1] === 'w' ? 'width' : 'height';
        const size = spacingScale[m[2]];
        if (size) return `${selector} { ${prop}: ${size}; }`;
      }
    },
  ];

  for (const parser of parsers) {
    const rule = parser();
    if (rule) return rule;
  }

  return null;
};

const withTailwind = (Component) => {
  return class extends Component {
    constructor(...args) {
      super(...args);
    }

    onRendered() {
      super.onRendered?.();

      const allElements = this.$$('[class]');
      const usedClasses = new Set();

      allElements.forEach((el) => {
        el.classList.forEach((cls) => {
          usedClasses.add(cls);
        });
      });

      let css = '';
      usedClasses.forEach((cls) => {
        const rule = parseClass(cls);
        if (rule) css += rule + '\n';
      });

      if (css) {
        const styleTag = document.createElement('style');
        styleTag.textContent = css;
        this.shadowRoot.appendChild(styleTag);
      }
    }
  };
};

export default withTailwind;
