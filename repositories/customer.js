import Exception from "../exceptions/Exception.js";
import { Customer } from "../models/index.js";
import { print, OutputType } from "../helpers/print.js";

const getAllCustomers = async ({ page, size, searchString }) => {
  // aggregate data for all students
  page = parseInt(page);
  size = parseInt(size);
  // searchString? name, route
  let filteredCustomers = await Customer.aggregate([
    {
      $match: {
        $or: [
          {
            name: { $regex: `.*${searchString}.*`, $options: "i" }, //ignore case
          },
          {
            route: { $regex: `.*${searchString}.*`, $options: "i" }, //ignore case
          },
        ],
      },
    },
    {
      $skip: (page - 1) * size,
    },
    {
      $limit: size,
    },
  ]);
  return filteredCustomers;
};

const insertCustomer = async ({
  id,
  name,
  imgUrl,
  link,
  isActive
}) => {
  try {
    const customer = await Customer.create({
      id,
      name,
      imgUrl,
      link,
      isActive,
    });
    return customer;
  } catch (exception) {
    if (!!exception.errors) {
      //error from validation
      throw new Exception("Input error", exception.errors);
    }
  }
};

async function insertMultiple(receivedCustomers) {
  if (!!receivedCustomers) {
    try {
      debugger;
      let customers = [];
      for (let i = 0; i < receivedCustomers.length; i++) {
        let customer = {
          name: receivedCustomers[i].name,
          imgUrl: receivedCustomers[i].imgUrl,
          link: receivedCustomers[i].link,
          isActive: receivedCustomers[i].isActive,
        };
        customers.push(customer);
      }
      debugger;
      await Customer.insertMany(customers);
    } catch (exception) {
      if (!!exception.errors) {
        debugger;
        //error from validation
        throw new Exception("Input error", exception.errors);
      }
    }
  }
  else {
    throw new Exception("Input error!")
  }
}

// const getStudentById = async (studentId) => {
//   const student = await Student.findById(studentId);
//   if (!student) {
//     throw new Exception("Cannot find student with id " + studentId);
//   }
//   return student ?? {}; // default value
// };

// const updateStudent = async ({
//   id,
//   name,
//   unit,
//   length,
//   route,
//   phoneNumber,
//   time,
//   routeNumber,
//   spacing,
// }) => {
//   //   console.log("insert student");
//   const bus = await Bus.findById(id);
//   debugger;
//   student.name = name ?? student.name;
//   student.email = email ?? student.email;
//   student.languages = languages ?? student.languages;
//   student.gender = gender ?? student.gender;
//   student.phoneNumber = phoneNumber ?? student.phoneNumber;
//   student.address = address ?? student.address;
//   await student.save();
//   return student;
// };

export default {
  getAllCustomers,
  insertCustomer,
  insertMultiple,
};
