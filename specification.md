# JSON Level Specification

## Objective

- Author a .mb64 level parser in typescript.
- Author a JSON-to-.mb64 level serializer in typescript.

## Context

All Mario Builder C modules are found in the `Mario-Builder-64` directory.

## Requirements

- `struct mb64_level_save_header` on line 315 of
  `Mario-Builder-64`/src/mb64/main.h` shall be deeply understood and studied,
  including all types its fields depend on.
- A TypeScript interface named `LevelMB64` shall be defined that matches the
  structure of `mb64_level_save_header`.
- enum style values (using `string` unions) shall be used for values in the
  struct that are represented as number types in `main.h`.
  - The toolbar type shall be a typescript string union matching the variants
    defined in comments by `mb64_ui_button_type`. All variants there are
    commented with `MB64_BUTTON_` prefixes. The typescript union shall omit the
    `MB64_BUTTON_` prefix.
    - The parser shall assert that these are non-nullable.
  - The material type shall be derived from `mb64_material mb64_mat_table`. The
    prefix `mat_maker_Maker` shall be omitted.
    - The parser shall assert that these are non-nullable.
  - `seq` should not accept numbers, it should use actual track strings as
    defined in `Mario-Builder-64`/src/mb64/menu_settings.c`.
- LevelMB64 shall include tile data and object data.
- A JSONSchema model shall be defined corresponding to the `LevelMB64`
  interface.
- The source shall be written in TypeScript and Deno.
