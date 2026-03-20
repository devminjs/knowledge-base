const [loadScribble] = Object.values(import.meta.glob("./scribble.ts"));

if (loadScribble) {
  await loadScribble();
} else {
  console.log("create a scribble.ts and place it in src.");
}
