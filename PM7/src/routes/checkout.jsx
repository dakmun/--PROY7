// checkout.jsx

import PaymentComponent from "../components/MercadoPago/PaymentComponent";
import  useAuth  from "../contexts/useAuth";
import Login from "../components/Login/Login";


export default function CheckoutRoute() {
  const { user, token } = useAuth();

  if (!token || !user._id) {

    return (
      <>
    <h1> Inicia Sesión para continuar con el checkout </h1>
    <Login />
</> 
    )

  } else {
    return (
      <>
    <PaymentComponent />;
    </>
    )
  }

}




