import { MAX_RECORDS } from "../Global/constants.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { customerRepository } from "../repositories/index.js";

async function getAllCustomers(req, res) {
  //http:localhost:3000?page=1&size=100
  // if user intend to pass 9999 to "size"
  let { page = 1, size = MAX_RECORDS, searchString = "" } = req.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;
  try {
    let filteredCustomers = await customerRepository.getAllCustomers({
      size,
      page,
      searchString,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Get all customers successfully",
      size: filteredCustomers.length,
      page,
      searchString,
      data: filteredCustomers,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function insertCustomer(req, res) {
  try {
    const customer = await customerRepository.insertCustomer(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert customer successfully",
      data: customer,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert customer:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function insertMultiple(req, res) {
  try {
    await customerRepository.insertMultiple(req.body);
    debugger
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert multiple customers successfully",
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert multiple customers:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

export default {
  getAllCustomers,
  insertCustomer,
  insertMultiple,
};
