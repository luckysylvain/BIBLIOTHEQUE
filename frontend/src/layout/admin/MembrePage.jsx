import React from 'react'
import { item, container } from '../../components/utils/variant'
import {motion} from 'framer-motion'
import { useGetMembresQuery } from '../../redux/slices/membreApiSlice'

const MembrePage = () => {

  const {data:membres, isLoading, isSuccess} = useGetMembresQuery()
  console.log(membres)

  return (
    <>
      <h1 className="text-center text-3xl font-semibold dark:text-white">Liste des membres</h1>
      <div className='px-3 my-2'> 
          <div className='grid grid-cols-6 space-x-1 items-center text-semibold font-bold w-full bg-slate-300 dark:bg-slate-800 dark:text-white text-slate-800 py-2 px-1 text-center '>
            
            <p>Nom et prénoms</p>
            <p>Email</p>
            <p>Addresse</p>
            <p>Date d'inscription</p>
            <p>Disponibilité</p>
            <p>Actions</p>
          </div>
          <motion.div key={1} variants={container}  initial="hidden" animate="visible">
            {isLoading ? "Loading ..." : membres?.data.map(membre => (
              <Row membre={membre} key={membre.id}/>
            ))}
          </motion.div>
      </div>
    </>
  )
}

export default MembrePage

function Row({membre}){
  return(<>
    <motion.div  variants={item} className='grid grid-cols-6 text-lg text-center border-b dark:text-white border-b-slate-700 last:border-b-0 py-2 '>
 
      <p>{membre.fullname}</p>
      <p>{membre.email}</p>
      <p>{membre.addresse}</p>
      <p>{new Date(membre.date_inscription).toDateString()}</p>
      <p>{membre.dispo === 1 ? 'Actif': 'Non Actif'}</p>
     
      <p>Actions</p>
    </motion.div>
  </>)
}
