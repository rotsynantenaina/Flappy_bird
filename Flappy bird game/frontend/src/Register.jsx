import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './styles/styleRegister.module.css';  // Importation du fichier CSS Modules

function Register() {
    const [nom_u, setNom] = useState("");
    const [prenom_u, setPrenom] = useState("");
    const [identifiant_u, setIdentifiant] = useState("");
    const [mdp_u, setMdp] = useState("");
    const [mdp2_u, setMdp2] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');  // Redirige vers la page de connexion
    };

    function register(event) {
        event.preventDefault();
        setErrorMessage(""); // Réinitialiser le message d'erreur

        // Vérifier si tous les champs sont remplis
        if (!nom_u || !prenom_u || !identifiant_u || !mdp_u || !mdp2_u) {
            setErrorMessage("⚠️ Remplir tous les champs !");
            return;
        }

        // Vérifier si les mots de passe correspondent
        if (mdp_u !== mdp2_u) {
            setErrorMessage("❌ Les mots de passe ne correspondent pas !");
            return;
        }

        axios.post("http://localhost:5000/register", {
            nom_u,
            prenom_u,
            identifiant_u,
            mdp_u
        })
        .then(res => {
            alert("✅ Inscription réussie !");
            navigate("/login");
        })
        .catch(err => {
            console.log(err);
            // Si l'identifiant existe déjà
            if (err.response && err.response.data.message === "Ce compte existe déjà") {
                setErrorMessage("⚠️ Ce compte existe déjà !");
            } else {
                setErrorMessage("❌ Une erreur est survenue. Veuillez réessayer.");
            }
        });
    }

    return (
        <div className={`${styles.content} d-flex justify-content-center align-items-center shadow-lg row`} id='content'>
        {/* PANNEAU DE GAUCHE */}
        <div className={`${styles.leftPanel} col-md-6 text-center d-flex flex-column align-items-center justify-content-center text-white p-4 rounded-start`}>
            <h1 className="mb-3 fw-bold">Bienvenue</h1>
            <p className="mb-4 fw-bold">Connectez-vous ou inscrivez-vous pour jouer à Flappy bird !</p>
            <img src="/images/panda1.png" alt="Flappy bird" className="img-fluid mb-3" style={{ maxWidth: "60%" }} />
            <button className={styles.loginBtn} onClick={handleClick}>SE CONNECTER</button>
        </div>

        <div className='col-md-6 d-flex justify-content-center'>
            <form onSubmit={register}>
                <div className="header-text mb-4">
                    <h1>Créer un compte</h1>
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><i className="bi bi-person-circle"></i></span>
                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Nom" onChange={e => setNom(e.target.value)} />
                        <label>Nom</label>
                    </div>
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><i className="bi bi-person-circle"></i></span>
                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Prénom" onChange={e => setPrenom(e.target.value)} />
                        <label>Prénom</label>
                    </div>
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><i className="bi bi-person-circle"></i></span>
                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Identifiant" onChange={e => setIdentifiant(e.target.value)} />
                        <label>Identifiant</label>
                    </div>
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Mot de passe" onChange={e => setMdp(e.target.value)} />
                        <label>Mot de passe</label>
                    </div>
                </div>

                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Confirmation du mot de passe" onChange={e => setMdp2(e.target.value)} />
                        <label>Confirmation du mot de passe</label>
                    </div>
                </div>

                {/* Affichage du message d'erreur */}
                {errorMessage && <p style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}>{errorMessage}</p>}

                <div className="input-group input-group-sm mb-3">
                    <button type="submit" className={styles.registerBtn}>S'inscrire</button>
                </div>
            </form>
        </div>
    </div>
    );
}


export default Register;
