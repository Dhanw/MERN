import React,{useContext} from "react";
import {Link} from 'react-router-dom'

import './UserItem.css'; 
import Avatar from '../../shared/components/UIElements/Avatar'
import Card from '../../shared/components/UIElements/Card'
import reactRouterDom from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

const UsersItem = props=>{
    const auth = useContext(AuthContext);
    return (
        <li className="user-item">
                <Card className="user-item__content"> 
                    <Link to={`/places/user/${props.id}`} >
                        <div className="user-item__image">
                            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
                        </div>
                        <div className="user-item__info">
                            <h2>{props.name}</h2>
                            <h3>{props.placeCount} {props.placeCount === 1 ? 'Place':'Places'}</h3>
                        </div>
                    </Link>
                </Card>
        </li>
    );
};

export default UsersItem;