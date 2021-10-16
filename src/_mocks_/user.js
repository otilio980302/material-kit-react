import faker from 'faker';
import { sample } from 'lodash';
import axios from 'axios';
import { useState, useEffect } from 'react';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

// const users1 = [...Array(2)].map((_, index) => ({
//   id: faker.datatype.uuid(),
//   avatarUrl: mockImgAvatar(index + 1),
//   name: 'willy philoma',
//   company: faker.company.companyName(),
//   isVerified: true,
//   status: 'active',
//   role: sample(['Leader', 'buyer'])
// }));

// const users = [
//   {
//     id: 1,
//     avatarUrl: mockImgAvatar(2),
//     name: 'willy philoma',
//     company: faker.company.companyName(),
//     isVerified: true,
//     status: 'active',
//     role: sample(['Leader', 'buyer'])
//   },
//   {
//     id: 1,
//     avatarUrl: mockImgAvatar(3),
//     name: 'Alfredo Perez',
//     company: faker.company.companyName(),
//     isVerified: true,
//     status: 'active',
//     role: sample(['Leader', 'buyer'])
//   }
// ];
// const Users = async () => {
//   const [User, setUser] = useState([]);
//   await axios.get(`https://backendomacore.herokuapp.com/getUser`).then((res) => {
//     setUser(res.data);
//   });
//   console.log(User);
//   return User;
// };

export default Users;
