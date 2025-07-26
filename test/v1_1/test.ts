import { parseMb64 } from "../../src/serde/v1_1/parser.ts";
import { serializeMb64 } from "../../src/serde/v1_1/serializer.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const fixturesDirname = join(import.meta.dirname ?? ".", "fixtures");
Deno.test("parse and serialize lvl.mb64 matches original", async () => {
  const filePath = join(fixturesDirname, "abc.mb64");
  const original = await Deno.readFile(filePath);
  const json = parseMb64(original);

  // Check piktcher shape
  if (!json.piktcher || json.piktcher.length !== 64) {
    console.error("piktcher outer length:", json.piktcher?.length);
    throw new Error("piktcher outer length mismatch");
  }
  for (let i = 0; i < 64; i++) {
    if (!json.piktcher[i] || json.piktcher[i].length !== 64) {
      console.error(`piktcher row ${i} length:`, json.piktcher[i]?.length);
      throw new Error(`piktcher row ${i} length mismatch`);
    }
  }

  // Write parsed JSON to sibling file before serialization
  const jsonPath = filePath + ".json";
  await Deno.writeTextFile(
    jsonPath,
    JSON.stringify(
      json,
      (_key, value) => typeof value === "bigint" ? value.toString() : value,
      2,
    ),
  );
  const serialized = serializeMb64(json);
  // parseMb64(serialized);
  if (original.length !== serialized.length) {
    console.error(
      `Length mismatch: original=${original.length}, serialized=${serialized.length}`,
    );
    const minLen = Math.min(original.length, serialized.length);
    for (let i = 0; i < minLen; i++) {
      if (original[i] !== serialized[i]) {
        console.error(
          `First byte mismatch at offset ${i}: original=${
            original[i]
          }, serialized=${serialized[i]}`,
        );
        console.error("Original bytes:", original.slice(i, i + 16));
        console.error("Serialized bytes:", serialized.slice(i, i + 16));
        break;
      }
    }
    throw new Error("Length mismatch");
  }
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== serialized[i]) {
      console.error(
        `Byte mismatch at offset ${i}: original=${original[i]}, serialized=${
          serialized[i]
        }`,
      );
      console.error("Original bytes:", original.slice(i, i + 16));
      console.error("Serialized bytes:", serialized.slice(i, i + 16));
      throw new Error("Byte mismatch");
    }
  }
});
