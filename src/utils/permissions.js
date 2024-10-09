let permissionsData = []

// user cooms => requests to create an employee => middleware is hit( OMG Seriously ?!) => Then middleware check if the user role is allowed to continue along with if their plan allows this method + any limitations if allowed => continue (with limitations, if any)

// {
//     "_id": "66b758464892ce3d994745c5",
//     "name": "SUPER_ADMIN",
//     "__v": 0
// },
// {
//     "_id": "66b7584c4892ce3d994745c8",
//     "name": "ADMIN",
//     "__v": 0
// },
// {
//     "_id": "66b758544892ce3d994745cb",
//     "name": "EMPLOYEE_SALES",
//     "__v": 0
// },
// {
//     "_id": "66b7585d4892ce3d994745ce",
//     "name": "EMPLOYEE_REMINDER",
//     "__v": 0
// }