const writeToFile = require("../util/writeToFile");
module.exports = (req, res) => {
  let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  let id = req.url.split("/")[3];
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  if (!regexV4.test(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is not valid",
      })
    );
  } else if (baseUrl === "/api/customers/" && regexV4.test(id)) {
    const index = req.customers.findIndex((customer) => {
      return customer.id === id;
    });
    if (index === -1) {
      res.statusCode = 404;
      res.write(
        JSON.stringify({ title: "Not Found", message: "Customer not found" })
      );
      res.end();
    } else {
      req.customers.splice(index, 1);
      writeToFile(req.customers);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.customers));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};
