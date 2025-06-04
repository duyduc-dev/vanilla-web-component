export const createStore = (createRootReducer) => {
  const reducers = createRootReducer();
  let state = {};

  // Initialize state by calling each reducer with undefined and an INIT action
  for (const key in reducers) {
    state[key] = reducers[key](undefined, { type: '@@INIT' });
  }

  const listeners = [];

  const getState = () => ({ ...state });

  const setState = (partialState) => {
    const nextState = { ...state, ...partialState };
    const hasChanged = Object.keys(nextState).some(
      (key) => nextState[key] !== state[key]
    );
    if (!hasChanged) return;
    state = nextState;
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  };

  const dispatch = (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const newPartialState = {};
    for (const key in reducers) {
      const prevStateSlice = state[key];
      const newStateSlice = reducers[key](prevStateSlice, action);
      if (newStateSlice !== prevStateSlice) {
        newPartialState[key] = newStateSlice;
      }
    }

    setState(newPartialState);
  };

  const connect = (mapStateToProps, mapDispatchToProps = () => ({})) => {
    return (Component) =>
      class extends Component {
        constructor(...args) {
          super(...args);
          this.props = {
            ...this.props,
            ...mapStateToProps(getState()),
            ...mapDispatchToProps(dispatch, getState()),
          };

          this.unsubscribe = subscribe((newState) => {
            this.props = {
              ...this.props,
              ...mapStateToProps(newState),
            };
            this._render?.();
          });
        }

        disconnectedCallback() {
          super.disconnectedCallback?.();
          this.unsubscribe();
        }
      };
  };

  return {
    getState,
    setState,
    subscribe,
    connect,
  };
};
