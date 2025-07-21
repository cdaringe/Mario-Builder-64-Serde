# Specification - Mario Builder 64 Level Parser & Serializer

## Requirements

- The site shall offer to pages--parse & serialize. The should be displayed on
  tabs, with the parse tab selected by default.
- The parse page page shall allow users to upload a `.mb64` level file into
  memory.
  - On upload, the file shall execute the level-json parser.
    - On no exception, the result shall appear in a JSON previewer pane on the
      page.
      - The JSON previewer shall actually be on the serialize page, allowing
        users to edit and export.
    - On exception, the error shall appear in an error pane on the page.
- The serialize page shall allow users to edit a JSON representation of a level
  in a JSON editor pane on the page.
  - The page shall include a button to execute the level-json serializer on the
    JSON in the editor pane.
    - On no exception, the result shall be offered as a download of a `.mb64`
      file, which happens all in memory as a blob download, matching the same
      filename that was uploaded.
    - On exception, the error shall appear in an error pane on the page.
- The implementation shall be written in TypeScript and be a static website.
  - The website shall primarily use `deno bundle` and raw HTML, TailwindCSS
    without a build tool, and inline javascript.
- The site shall be deployed to GitHub Pages.
  - The site shall be built and deployed using a GitHub Actions workflow.
  - The site shall be deployed to the `gh-pages` branch of the repository.
  - The site shall be available at
    https://cdaringe.github.io/Mario-Builder-64/level-json/
