import UserOrders from "./UserOrders";
import UpdateUserSection from "./UpdateUserSection";
import ProfileCard from "./ProfileCard";
import { Container } from "@mui/material";


export default function Profile() {


  return (
  <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
      <ProfileCard  />
      <UpdateUserSection  />
      <UserOrders />
    </Container>
  );

}

