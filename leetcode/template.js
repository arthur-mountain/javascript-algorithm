const main = () => {
  const filename = process.argv[2];
  if (!filename) throw new Error("Filename is required");
  require("node:fs").writeFileSync(
    `${__dirname}/${filename}.js`,
    `/*
 * Status:
 *  - [] Done
 *  - [] Follow-up solutions
 *
 * Title:
 *
 * Topics:
 *
 * Constraints:
 *
 * Statements:
 **/
`,
  );
};

main();
