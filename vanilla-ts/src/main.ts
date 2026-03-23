import "./style/main.css";

async function loadScript() {
  const [loadScribble] = Object.values(import.meta.glob("./scribble.ts"));

  if (loadScribble) {
    await loadScribble();
  } else {
    console.log("create a scribble.ts and place it in src.");
  }
}

function mountView() {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `    
    <div class="p-4">
      <h1 class="text-sm">Learn js coding questions!</h1>
    </div>
    `;
  }
}

async function main() {
  try {
    mountView();
    await loadScript();
  } catch (error) {
    console.error("Error loading script:", error);
  }
}

await main();
