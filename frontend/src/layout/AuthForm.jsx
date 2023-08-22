import React, { useState, useCallback } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { motion } from "framer-motion";
import CircleLoader from "../components/CircleLoader/CircleLoader";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../redux/slices/membreApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import { container } from "../components/utils/variant";

const AuthForm = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  if (userInfo !== null) {
    return <Navigate to='/admin'/>
  };
  const [variant, setVariant] = useState("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [addresse, setAddresse] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nomError, setNomError] = useState("");
  const [addresseError, setAddresseError] = useState("");

  const [login, { isLoading: loadingLogin, isSuccess: successLogin, isError }] =
    useLoginMutation();
  const [register, { isLoading: loadingRegister, isSuccess: successRegister }] =
    useRegisterMutation();

  const toggleVariant = useCallback(() => {
    variant === "LOGIN" ? setVariant("REGISTER") : setVariant("LOGIN");
  }, [variant]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setNomError("");
    setAddresseError("");
    if (variant === "REGISTER") {
      if (fullname === "") {
        setNomError("Veuiller entrer votre nom complet");
        return;
      }
      if (addresse === "") {
        setAddresseError("Veuillez entrer votre addresse");
        return;
      }
    }

    if (email === "") {
      setEmailError("Veuiller entrer votre email");
      return;
    }
    if (password === "") {
      setPasswordError("Veuiller entrer votre mot de passe");
      return;
    }
    if (variant === "LOGIN") {
      try {
        const res = await login({ email, password }).unwrap();
        toast.success("Vous êtes connecté ");
        dispatch(setCredentials({ ...res }));

        setEmail("");
        setPassword("");
        navigate("/admin");
      } catch (error) {
        const { field, error: text } = error.data;
        console.log(error);
        if (field === "email") setEmailError(text);
        else setPasswordError(text);
      }
    } else {
      try {
        const res = await register({
          email,
          password,
          fullname,
          addresse,
          admin: 0,
        }).unwrap();
        setEmail("");
        setPassword("");
        setAddresse("");
        setFullname("");
        toast.success("Vous êtes inscrit! Vous pouvez maintenant se connecter");
      } catch (error) {
        setEmailError("Veuillez choisir un autre email");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-slate-200  rounded-xl flex overflow-hidden">
        <div className="w-1/2 h-full overflow-hidden">
          <img
            src="./photo.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full px-20 flex items-center justify-center flex-col  ">
          <h2 className="text-3xl text-center py-4 font-medium">
            {variant === "LOGIN" ? "Se connecter " : "Créer un compte"}
          </h2>
          <motion.form
            onSubmit={handleSubmit}
            key={variant}
            variants={container}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col space-y-2 "
          >
            {variant === "REGISTER" && (
              <>
                <Input
                  label={"Nom et prénoms"}
                  id="fullname"
                  value={fullname}
                  setValue={setFullname}
                  type="text"
                  placeholder="Entrer votre nom complet"
                  error={nomError}
                />
                <Input
                  label={"Addresse"}
                  id="addresse"
                  value={addresse}
                  setValue={setAddresse}
                  type="text"
                  placeholder="Entrer votre addresse"
                  error={addresseError}
                />
              </>
            )}
            <Input
              label={"Email"}
              id="email"
              value={email}
              setValue={setEmail}
              type="text"
              placeholder="Entrer votre email"
              error={emailError}
            />
            <Input
              label={"Mot de passe"}
              id="password"
              value={password}
              setValue={setPassword}
              type="password"
              placeholder="Entrer votre mot de passe"
              error={passwordError}
            />
            <Button styles="w-full bg-indigo-600 hover:bg-indigo-700 focus-visible:bg-indigo-700 text-white">
              {loadingLogin || loadingRegister ? (
                <CircleLoader width="30px" white="stroke-white"/>
              ) : variant === "LOGIN" ? (
                "Se connecter"
              ) : (
                "S'inscrire"
              )}
            </Button>
          </motion.form>
          <div className="flex gap-2 justify-center  mt-6 px-2 text-gray-500">
            <div>
              {variant === "LOGIN"
                ? "Vous n'êtes pas encore inscrit ?"
                : "Vous avez déjà une compte ? "}
            </div>
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === "LOGIN" ? "Créer un compte" : "Se connecter"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
