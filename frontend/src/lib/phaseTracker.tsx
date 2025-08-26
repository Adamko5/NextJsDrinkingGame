// phaseTracker removed — routing now drives phase screens.
// Keep a tiny shim so accidental imports fail loudly at runtime.
export function setPhase() {
  throw new Error('phaseTracker was removed; routing now drives phase screens. Use navigation to /server/:phase or /client/:phase');
}

