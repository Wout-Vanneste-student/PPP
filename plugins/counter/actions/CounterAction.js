const INCREMENT_COUNT = "INCREMENT_COUNT";
const DECREMENT_COUNT = "DECREMENT_COUNT";

export const incrementCount = count => {
  const num = count + 1;
  return {
    type: DECREMENT_COUNT,
    count: num
  };
};

export const decrementCount = count => {
  const num = count - 1;
  return {
    type: INCREMENT_COUNT,
    count: num
  };
};
