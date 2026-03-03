export default function delay(time, value) {
  return new Promise((resolve) => setTimeout(resolve, time, value));
}
