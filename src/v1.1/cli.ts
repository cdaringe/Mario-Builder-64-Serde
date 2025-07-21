// CLI entrypoint for level-json
// Usage: deno run --allow-read --allow-write cli.ts <command> <args>
import { parseMb64 } from "./parser.ts";
import { serializeMb64 } from "./serializer.ts";
import { LevelMB64 } from "./types.ts";

function printUsage() {
  console.log("Usage: cli.ts <parse|serialize> <input> <output>");
}

if (import.meta.url === `file://${Deno.mainModule}`) {
  (async () => {
    const [cmd, input, output] = Deno.args;
    if (!cmd || !input || !output) {
      printUsage();
      Deno.exit(1);
    }
    if (cmd === "parse") {
      const data = await Deno.readFile(input);
      const level = parseMb64(data);
      await Deno.writeTextFile(output, JSON.stringify(level, null, 2));
    } else if (cmd === "serialize") {
      const json = await Deno.readTextFile(input);
      const level = JSON.parse(json) as LevelMB64;
      const data = serializeMb64(level);
      await Deno.writeFile(output, data);
    } else {
      printUsage();
      Deno.exit(1);
    }
  })();
}
