/**
 * UMD/IIFE browser entry point.
 *
 * Exports the processor as the ONLY (default) export so the IIFE bundle
 * assigns the bare callable to the global - `JSnumberToWordProcessor(...)`
 * works in a `<script>` tag exactly like v3.
 */

import { JSnumberToWordProcessor } from "./index.js";

export default JSnumberToWordProcessor;
