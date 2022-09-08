const { parser: jsonlParser } = require("stream-json/jsonl/Parser");
const { parser } = require("stream-json/Parser");
const { createReadStream } = require("fs");

Promise.resolve()
  .then(() =>
    bench(
      "json parser",
      10,
      () =>
        new Promise((resolve) => {
          const pipeline = createReadStream("data.json").pipe(parser());
          pipeline.on("data", (data) => {});
          pipeline.on("end", () => resolve());
        })
    )
  )
  .then(() =>
    bench(
      "jsonl parser",
      10,
      () =>
        new Promise((resolve) => {
          const pipeline = createReadStream("datand.json").pipe(jsonlParser());
          pipeline.on("data", (data) => {});
          pipeline.on("end", () => resolve());
        })
    )
  );

async function bench(name, attempts, run, opts) {
  const benchName = `${name} x${attempts}`;

  if (opts && opts.before) {
    try {
      await opts.before();
    } catch (err) {
      console.log("BENCH BEFORE", err);
    }
  }

  console.time(benchName);
  try {
    console.profile(benchName);
    for (let n = 0; n < attempts; n++) {
      await run();
    }
    console.profileEnd(benchName);
  } catch (err) {
    console.log("BENCH ERROR", err);
  }
  console.timeEnd(benchName);

  if (opts && opts.after) {
    try {
      await opts.after();
    } catch (err) {
      console.log("BENCH AFTER", err);
    }
  }
}
