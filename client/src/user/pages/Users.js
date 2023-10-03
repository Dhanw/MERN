import React from "react";
import UsersList from "../components/UserList";

const Users =()=>{
    // This is dummy data to work with at first
    const USERS=[
        {
            id: 'u1',
            name:'Maximun Vergonhio',
            image:'https://media.istockphoto.com/id/1322913815/es/foto/joven-barbudo-de-negocios-sentado-en-el-escritorio-y-posando.jpg?s=1024x1024&w=is&k=20&c=Do2AxEzLFXjkIm1FPCweWcCe2XKdKWCjcl8eOWngIzg=',
            places: 3  
        }
        ];
    
    return <UsersList items={USERS} />
};

export default Users;