import React from 'react';
import { withFirebase } from '../Firebase';
import { IconButton } from '@material-ui/core';
import { FiLogOut } from "react-icons/fi"

const SignOutButton = ({ firebase }) => (
  <IconButton variant="outlined" onClick={firebase.doSignOut}>
    <FiLogOut />
  </IconButton>
);

export default withFirebase(SignOutButton);