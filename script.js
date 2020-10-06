let wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
let wasmTable = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: "anyfunc",
});

let wasmExports;
let asmLibraryArg = {
  __handle_stack_overflow: () => {}, // used to log messages whene vent occurs
  emscripten_resize_heap: () => {}, // used to log when memory allocation exceeds it memory limit
  __lock: () => {},
  __unlock: () => {},
  memory: wasmMemory,
  table: wasmTable,
};

let info = {
  env: asmLibraryArg, // environment in which web assembly will load
  wasi_snapshot_preview1: asmLibraryArg,
};

async function loadWasm() {
  let response = await fetch("arithmetic.wasm");
  let bytes = await response.arrayBuffer();
  let wasmObj = await WebAssembly.instantiate(bytes, info);
  wasmExports = wasmObj.instance.exports;
}

loadWasm();
