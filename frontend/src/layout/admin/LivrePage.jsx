import React, { useState, useCallback, useEffect } from "react";
import Button from "../../components/Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal/Modal";
import { useUploadImageMutation } from "../../redux/slices/uploadSlice";
import {
  useCreateLivreMutation,
  useGetLivresQuery,
  useDeleteLivreMutation,
  useUpdateLivreMutation,
  useGetLivreByIdQuery,
} from "../../redux/slices/livreApiSlice";
import { RiImageAddLine } from "react-icons/ri";
import CircleLoader from "../../components/CircleLoader/CircleLoader";
import { BASE_URL } from "../../redux/constants";
import Input from "../../components/Input/Input";
import { container, item } from "../../components/utils/variant";
import Message from "../../components/Message/Message";
import Success from "../../components/Success/Success";
import { VscError } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import { formatDateToCustomFormat } from "../../components/utils/func";
import clsx from "clsx";
import { FcFullTrash } from "react-icons/fc";
import { MdDelete, MdOutlineEdit } from "react-icons/md";

const formatDate = (date) => {
  const tab = date.split("/");
  return `${tab[2]}-${tab[1]}-${tab[0]}`;
};

const LivrePage = () => {
  const [addModal, setAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const toggleAddModal = useCallback(() => {
    setAddModal(!addModal);
  }, [addModal]);

  const { data: livres, isLoading, refetch } = useGetLivresQuery();

  const [deleteModal, setDeleteModal] = useState(false);

  const toggleDeleteModal = useCallback(
    () => setDeleteModal(!deleteModal),
    [deleteModal]
  );

  const [updateModal, setUpdateModal] = useState(false);

  const toggleUpdateModal = useCallback(
    () => {setUpdateModal(!updateModal)},
    [updateModal]
  );

  return (
    <>
      <h1 className="text-center text-3xl font-semibold dark:text-white">Liste des livres</h1>
      <div className="w-full flex justify-end">
        <Button
          onClick={toggleAddModal}
          styles="bg-indigo-600 font-normal  text-white"
        >
          Ajouter un livre
        </Button>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap"
      >
        {/* <LivreItem /> */}

        {livres?.data.map((livre) => (
          <LivreItem
            livre={livre}
            key={livre.id}
            toggleDeleteModal={toggleDeleteModal}
            toggleUpdateModal={toggleUpdateModal}
            setSelectedId={setSelectedId}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {addModal && (
          <AddModal toggleAddModal={toggleAddModal} refetch={refetch} />
        )}
        {deleteModal && (
          <DeleteModal
            toggleDeleteModal={toggleDeleteModal}
            refetch={refetch}
            id={selectedId}
          />
        )}
        {updateModal && (
          <UpdateModal
            toggleUpdateModal={toggleUpdateModal}
            refetch={refetch}
            id={selectedId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LivrePage;

function LivreItem({
  livre,
  toggleDeleteModal,
  setSelectedId,
  toggleUpdateModal,
}) {
  return (
    <motion.div
      variants={item}
      className="w-[450px] h-[275px] bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow p-3 flex space-x-1 m-3"
    >
      <img
        src={BASE_URL + "/" + livre.image}
        alt=""
        className="w-[40%] h-full object-contain"
      />
      <div>
        <h2 className="text-2xl font-bold ">{livre.titre}</h2>
        <p className="text-lg">
          Ecrit par <span className="font-semibold">{livre.auteur}</span>
        </p>
        <p className="text-lg">
          Genre : <span className="font-semibold">{livre.genre}</span>
        </p>
        <p className="text-lg">
          <span className="font-semibold">{livre.pages}</span> pages{" "}
        </p>
        <p className="text-lg">
          Publié le{" "}
          <span className="font-semibold">
            {new Date(livre.date_publication).toDateString()}
          </span>{" "}
        </p>
        <div
          className={clsx(
            "  w-max text-white rounded ",
            livre.dispo === 1 ? "bg-green-600" : "bg-rose-600"
          )}
        >
          {livre.dispo === 1 ? "Disponible" : "Non disponible"}
        </div>
        <OptionsFunctionnality
          id={livre.id}
          toggleDeleteModal={toggleDeleteModal}
          toggleUpdateModal={toggleUpdateModal}
          setSelectedId={setSelectedId}
        />
      </div>
    </motion.div>
  );
}

function AddModal({ toggleAddModal, refetch }) {
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();
  const [createLivre, { isLoading, isSuccess, isError }] =
    useCreateLivreMutation();

  const [image, setImage] = useState(null);
  const [titre, setTitre] = useState("");
  const [pages, setPage] = useState(0);
  const [auteur, setAuteur] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [genre, setGenre] = useState("");
  const [titreError, setTitreError] = useState("");
  const [pagesError, setPageError] = useState("");
  const [auteurError, setAuteurError] = useState("");
  const [datePublicationError, setDatePublicationError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [showContent, setShowContent] = useState(true);
  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      setImage(res.filename);
    } catch (error) {
      toast.error(error);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setAuteurError("");
    setDatePublicationError("");
    setPageError("");
    setGenreError("");
    setTitreError("");
    if (titre === "") {
      setTitreError("Veuiller entre le titre");
      return;
    }
    if (genre === "") {
      setGenreError("Veuiller entre le genre");
      return;
    }
    if (datePublication === "") {
      setDatePublicationError("Veuiller entre la date");
      return;
    }
    if (pages === "") {
      setPageError("Veuiller entre le nombre de pages");
      return;
    }
    if (auteur === "") {
      setAuteurError("Veuiller entre l'auteur");
      return;
    }

    try {
      const date = formatDateToCustomFormat(datePublication);
      setShowContent(false);
      const res = await createLivre({
        titre,
        auteur,
        pages,
        image,
        genre,
        date_publication: date,
      }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleAddModal();
      }, 2000);
    }
  }, [isSuccess]);

  return (
    <Modal closeModal={toggleAddModal} options="w-[600px]">
      {showContent && (
        <div>
          <h1 className="text-center font-semibold text-2xl dark:text-white">
            Ajouter un livre
          </h1>
          <form onSubmit={formHandler} className="w-full dark:text-white ">
            <div className="w-full h-[150px] relative flex items-center justify-center border border-dashed py-3 border-gray-500 flex-col">
              <input
                type="file"
                name="background"
                onChange={uploadFileHandler}
                className="w-full h-full opacity-0 absolute cursor-pointer z-50"
              />
              {image === null ? (
                <>
                  <RiImageAddLine className=" text-8xl" />
                  <p className="">Choisir une image de fond pour le livre</p>
                </>
              ) : loadingUpload ? (
                <div className="w-full h-full  flex items-center justify-center absolute">
                  <CircleLoader options="w-[50%]" white={"dark:stroke-white"} />
                </div>
              ) : (
                <div className="w-full h-full absolute flex items-center justify-center z-10">
                  <img
                    src={BASE_URL + "/" + image}
                    className="w-[95%] h-[95%] object-contain"
                  />
                </div>
              )}
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-1"
            >
              <Input
                type="text"
                label="Titre"
                error={titreError}
                value={titre}
                setValue={setTitre}
              />
              <Input
                type="text"
                label="Auteur"
                error={auteurError}
                value={auteur}
                setValue={setAuteur}
              />
              <div className="flex space-x-3">
                <Input
                  type="date"
                  label="Date de publication"
                  error={datePublicationError}
                  value={datePublication}
                  setValue={setDatePublication}
                />
                <Input
                  type="number"
                  label="Nombre de pages"
                  error={pagesError}
                  value={pages}
                  setValue={setPage}
                />
              </div>
              <Input
                type="text"
                label="Genre"
                error={genreError}
                value={genre}
                setValue={setGenre}
              />
            </motion.div>
            <div className="flex items-center justify-center space-x-5 my-2">
              <Button styles="text-white bg-blue-600 px-5">Ajouter</Button>
              <Button
                onClick={toggleAddModal}
                styles="text-white bg-rose-600 px-5"
              >
                Fermer
              </Button>
            </div>
          </form>
        </div>
      )}
      <div className="w-full h-full flex items-center justify-center dark:text-white">
        {!showContent &&
          (isLoading ? (
            <Message
              icon={<CircleLoader white={""} options="" width={"175px"} />}
              message="Ajout en cours"
            />
          ) : isSuccess ? (
            <Message icon={<Success />} message="Ajout réussi" />
          ) : (
            isError && (
              <Message
                icon={<VscError className="text-red-500 text-8xl" />}
                message={"Une erreur s'est produite"}
              />
            )
          ))}
      </div>
    </Modal>
  );
}

function OptionsFunctionnality({
  id,
  toggleDeleteModal,
  toggleUpdateModal,
  setSelectedId,
}) {
  const deleteFunc = () => {
    setSelectedId(id);
    toggleDeleteModal();
  };
  const updateFunc = () => {
    setSelectedId(id);
    toggleUpdateModal();
  };
  return (
    <div className="flex justify-end items-center space-x-4">
      <div
        onClick={deleteFunc}
        className="w-10 h-10 bg-rose-600 flex justify-center items-center rounded-full"
      >
        <MdDelete className=" text-3xl text-white" />
      </div>
      <div
        onClick={updateFunc}
        className="w-10 h-10 bg-green-600 flex justify-center items-center rounded-full"
      >
        <MdOutlineEdit className=" text-3xl text-white" />
      </div>
    </div>
  );
}

function DeleteModal({ toggleDeleteModal, id, refetch }) {
  const [deleteLivre, { isLoading, isError, isSuccess }] =
    useDeleteLivreMutation();
  const [showContent, setShowContent] = useState(true);

  const deleteHandler = async () => {
    try {
      setShowContent(false);
      const res = await deleteLivre(id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleDeleteModal();
      }, 2000);
    }
  }, [isSuccess]);

  return (
    <Modal options="w-[500px]" closeModal={toggleDeleteModal} flip={true}>
      {showContent && (
        <div className="flex items-center justify-center flex-col h-full">
          <h1 className="text-center text-3xl font-semibold dark:text-white">
            Voulez vous vraiment supprimer cette livre ?
          </h1>
          <FcFullTrash className="text-[150px]" />
          <div className="flex items-center justify-center space-x-3 mt-5">
            <Button onClick={deleteHandler} styles="bg-rose-600 text-white">
              Oui, supprimer
            </Button>
            <Button onClick={toggleDeleteModal} styles="bg-sky-600 text-white">
              Fermer
            </Button>
          </div>
        </div>
      )}
      <div className="w-full h-full dark:text-white">
        {!showContent &&
          (isLoading ? (
            <Message
              icon={<CircleLoader white={"dark:stroke-white"} options="" width={"175px"} />}
              message="Suppression  en cours"
            />
          ) : isSuccess ? (
            <Message icon={<Success />} message="Suppression réussi" />
          ) : (
            isError && (
              <Message
                icon={<VscError className="text-red-500 text-8xl" />}
                message={"Une erreur s'est produite"}
              />
            )
          ))}
      </div>
    </Modal>
  );
}

function UpdateModal({ toggleUpdateModal, id, refetch }) {
  const [uploadImage, { isLoading: loadingUpload }] = useUploadImageMutation();
  const [updateLivre, { isLoading, isSuccess, isError }] =
    useUpdateLivreMutation();
  const { data: livre, isSuccess: successData } = useGetLivreByIdQuery(id);

  const [image, setImage] = useState(null);
  const [titre, setTitre] = useState("");
  const [pages, setPage] = useState(0);
  const [auteur, setAuteur] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [genre, setGenre] = useState("");
  const [titreError, setTitreError] = useState("");
  const [pagesError, setPageError] = useState("");
  const [auteurError, setAuteurError] = useState("");
  const [datePublicationError, setDatePublicationError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [showContent, setShowContent] = useState(true);

  const uploadFileHandler = async (e) => {
    const formdata = new FormData();

    formdata.append("image", e.target.files[0]);

    try {
      const res = await uploadImage(formdata).unwrap();
      setImage(res.filename);
    } catch (error) {
      toast.error(error);
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setAuteurError("");
    setDatePublicationError("");
    setPageError("");
    setGenreError("");
    setTitreError("");
    if (titre === "") {
      setTitreError("Veuiller entre le titre");
      return;
    }
    if (genre === "") {
      setGenreError("Veuiller entre le genre");
      return;
    }
    if (datePublication === "") {
      setDatePublicationError("Veuiller entre la date");
      return;
    }
    if (pages === "") {
      setPageError("Veuiller entre le nombre de pages");
      return;
    }
    if (auteur === "") {
      setAuteurError("Veuiller entre l'auteur");
      return;
    }

    try {
      const date = formatDateToCustomFormat(datePublication);
      setShowContent(false);
      const res = await updateLivre({
        titre,
        auteur,
        pages,
        image,
        genre,
        date_publication: date,
        id
      }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toggleUpdateModal();
      }, 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (successData) {
      setImage(livre?.data.image);
      setAuteur(livre?.data.auteur);
      setPage(livre?.data.pages);
      setDatePublication(livre?.data.date_publication);
      setGenre(livre?.data.genre);
      setTitre(livre?.data.titre);
    }
  }, [successData]);

  return (
    <Modal closeModal={toggleUpdateModal} options="w-[600px]" flip={true}>
      {showContent && (
        <div>
          <h1 className="text-center font-semibold text-xl">
            Modifier un livre
          </h1>
          <form onSubmit={formHandler} className="w-full ">
            <div className="w-full h-[150px] relative flex items-center justify-center border border-dashed py-3 border-gray-500 flex-col">
              <input
                type="file"
                name="background"
                onChange={uploadFileHandler}
                className="w-full h-full opacity-0 absolute cursor-pointer z-50"
              />
              {image === null ? (
                <>
                  <RiImageAddLine className=" text-8xl" />
                  <p className="">Choisir une image de fond pour le livre</p>
                </>
              ) : loadingUpload ? (
                <div className="w-full h-full  flex items-center justify-center absolute">
                  <CircleLoader options="w-[50%]" white={"dark:stroke-white"} />
                </div>
              ) : (
                <div className="w-full h-full absolute flex items-center justify-center z-10">
                  <img
                    src={BASE_URL + "/" + image}
                    className="w-[95%] h-[95%] object-contain"
                  />
                </div>
              )}
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-col space-y-1"
            >
              <Input
                type="text"
                label="Titre"
                error={titreError}
                value={titre}
                setValue={setTitre}
              />
              <Input
                type="text"
                label="Auteur"
                error={auteurError}
                value={auteur}
                setValue={setAuteur}
              />
              <div className="flex space-x-3">
                <Input
                  type="date"
                  label="Date de publication"
                  error={datePublicationError}
                  value={formatDate(
                    new Date(datePublication).toLocaleDateString()
                  )}
                  setValue={setDatePublication}
                />
                <Input
                  type="number"
                  label="Nombre de pages"
                  error={pagesError}
                  value={pages}
                  setValue={setPage}
                />
              </div>
              <Input
                type="text"
                label="Genre"
                error={genreError}
                value={genre}
                setValue={setGenre}
              />
            </motion.div>
            <div className="flex items-center justify-center space-x-5 my-2">
              <Button styles="text-white bg-green-600 px-5">Modifier</Button>
              <Button
                onClick={toggleUpdateModal}
                styles="text-white bg-rose-600 px-5"
              >
                Fermer
              </Button>
            </div>
          </form>
        </div>
      )}
      <div className="w-full h-full flex items-center justify-center">
        {!showContent &&
          (isLoading ? (
            <Message
              icon={<CircleLoader white={"dark:stroke-white"} options="" width={"175px"} />}
              message="Modification en cours"
            />
          ) : isSuccess ? (
            <Message icon={<Success />} message="Modification réussi" />
          ) : (
            isError && (
              <Message
                icon={<VscError className="text-red-500 text-8xl" />}
                message={"Une erreur s'est produite"}
              />
            )
          ))}
      </div>
    </Modal>
  );
}
