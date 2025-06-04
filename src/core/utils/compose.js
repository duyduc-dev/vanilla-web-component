export const compose =
  (...hocs) =>
  (BaseComponent) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), BaseComponent);
