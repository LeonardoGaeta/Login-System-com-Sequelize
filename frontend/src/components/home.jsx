import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react"

export function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/check-session")
            .then(res => {
                if (!res.data.valid) {
                    throw new Error("Login inválido.");
                }
            })
            .catch(err => {
                console.error(err);
                navigate("/login")
            });
    }, [navigate]);

    function handleLogout() {
        axios.post("/logout")
        .then(res => {
            console.log(res.data.message);
            navigate("/login");
        })
        .catch(err => {
            console.error("Erro ao deslogar: ", err);
        })
    }

    return(
        <div>
            <h1>A</h1>

            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}