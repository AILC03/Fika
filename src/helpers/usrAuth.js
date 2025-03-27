import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const url = "https://api-legisconnect-production.up.railway.app/users/authSession";

            try {
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();

                console.log(data);

                if (!response.ok) {
                    navigate("/");
                } else {
                    console.log("Token validado");
                }
            } catch (error) {
                // @ts-ignore
                console.error({ errores: error.message });
            }
        };

        checkAuth();
    }, [navigate]); // useEffect se ejecuta cuando `navigate` cambia

};

export default useUserAuth;