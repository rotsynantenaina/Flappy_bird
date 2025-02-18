import React, { useState, useEffect } from "react";  
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles/styleLogin.module.css"; // Importation du fichier CSS Modules

function Login() {
    const [identifiant, setIdentifiant] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState(""); // Pour afficher les messages de connexion
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("userId")) {
            navigate("/login");  // Redirige vers la page d'accueil si un utilisateur est déjà connecté
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await axios.post("http://localhost:5000/login", {
                identifiant_u: identifiant,
                mdp_u: mdp
            });
    
            console.log("Réponse du serveurs :", response.data.id_u); // Vérification
    
            if (response.data.id_u) {
                localStorage.setItem("userId", response.data.id_u);
                console.log("ID stocké dans localStorage :", localStorage.getItem("userId"));
    
                navigate("/home"); // Redirige vers Home après connexion
            } else {
                setMessage(response.data.message || "Erreur de connexion.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setMessage(error.response?.data?.message || "Problème de connexion !");
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className={`${styles.content} d-flex justify-content-center align-items-center shadow-lg row`}>
            <div className={`${styles.leftPanel} col-md-6 text-center d-flex flex-column align-items-center justify-content-center text-white p-4 rounded-start`}>
                <form onSubmit={handleSubmit}>
                    <div className="header-text mb-4">
                        <h1>Connexion</h1>
                    </div>

                    <div className="input-group input-group-sm mb-3 shadow-sm rounded">
                        <span className="input-group-text bg-primary text-white border-0">
                            <i className="bi bi-person-circle"></i>
                        </span>
                    <div className="form-floating flex-grow-1">
                        <input 
                            type="text" 
                            className="form-control border-0" 
                            placeholder="Identifiant" 
                            id="identifiant" 
                            name="identifiant" 
                            value={identifiant}
                            onChange={e => setIdentifiant(e.target.value)} 
                            required
                        />
                        <label htmlFor="identifiant">Identifiant</label>
                    </div>
                </div>


                <div className="input-group input-group-sm mb-3 shadow-sm rounded">
                <span className="input-group-text bg-primary text-white border-0">
                    <i className="bi bi-lock-fill"></i>
                </span>
                <div className="form-floating flex-grow-1">
                    <input 
                        type="password" 
                        className="form-control border-0" 
                        placeholder="Mot de passe" 
                        id="mdp" 
                        name="mdp" 
                        value={mdp}
                        onChange={e => setMdp(e.target.value)}
                        required
                    />
                    <label htmlFor="mdp">Mot de passe</label>
                </div>
                </div>


                <button 
                    type="submit" 
                    className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'} w-100 py-2 mt-3 rounded shadow-sm`} 
                    disabled={isLoading}
                >
                    {isLoading ? "Connexion..." : "Se connecter"}
                </button>

                </form>
                {message && <p className={styles.errorMessage}>{message}</p>} {/* Affichage du message */}
            </div>

            <div className={`${styles.rightPanel} col-md-6 d-flex flex-column align-items-center justify-content-center text-white p-4 rounded-end`}>
                <h1 className="mb-3 text-dark font-weight-bold">Ou inscrivez-vous</h1>
                <p className="mb-4 text-dark">Inscrivez-vous si vous n'avez pas encore de compte</p>
                <img src="/images/panda2.png" alt="" className="img-fluid mb-3" style={{ maxWidth: "50%" }}/>
                <button className={styles.registerBtn} onClick={() => navigate("/")}>S'inscrire</button>
            </div>
        </div>
    );
}

export default Login;
