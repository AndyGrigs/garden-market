import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { setUser } from '../store/slices/authSlice';
import AnimatedRoutes from './AnimatedRoutes';
import { motion } from 'framer-motion';


const AuthLoader = () => {
    const dispatch = useDispatch();
    const {data: user, isLoading} = useGetCurrentUserQuery();
    
    
    useEffect(()=>{
      if(user){
        dispatch(setUser(user));
      }
    }, [dispatch, user])

    if(isLoading) return (
       <div className="flex justify-center items-center min-h-[400px]">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-emerald-600"
          />
       </div>
    )

  return <AnimatedRoutes />
}

export default AuthLoader