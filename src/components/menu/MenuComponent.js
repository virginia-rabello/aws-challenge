import React from "react";
import "./MenuComponent.css";
import { Menu, MenuItem } from '@aws-amplify/ui-react';

export const MenuComponent = ({signOut, createSlideModalOpen, toggleCreateSlideModal}) => {
    return (        
       <Menu>
        <MenuItem onClick={() => toggleCreateSlideModal(!createSlideModalOpen)}>Create Slide</MenuItem>
        <MenuItem onClick={signOut}>Sign Out</MenuItem>
       </Menu>
    )
}
