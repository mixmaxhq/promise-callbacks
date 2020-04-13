export default function immediate(value) {
  return new Promise((resolve) => setImmediate(resolve, value));
}
