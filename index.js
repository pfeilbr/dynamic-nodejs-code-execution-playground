const fs = require("fs");

const randomString = () => {
  const between = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return `${new Date().getTime()}-${between(0, Number.MAX_SAFE_INTEGER)}`;
};

const dynamicExecution = (code, event = null) => {
  const filename = `${randomString()}.js`;
  fs.writeFileSync(filename, code);
  try {
    const mod = require(`./${filename}`);

    // if module exports function, run it with parameter
    if (typeof mod === "function") {
      mod(event);
    }
  } catch (err) {
    console.error(err);
  } finally {
    fs.unlinkSync(filename);
  }
};

const code = `
(async () => {
    console.log("hello")
})()
`;

const handlerCode = `
const handler = async (event) => {
    console.log(JSON.stringify(event, null, 2))
}

module.exports = handler
`;

// running code
dynamicExecution(code);

// running code and passing parameter
dynamicExecution(handlerCode, { msg: "hello" });
