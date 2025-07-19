import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { setUser } from '../store/slices/authSlice';
import AnimatedRoutes from './AnimatedRoutes';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const AuthLoader = () => {
    const dispatch = useDispatch();
    
    // Only fetch current user if we have a token
    const hasToken = !!Cookies.get('user');
    const {data: user, isLoading} = useGetCurrentUserQuery(undefined, {
      skip: !hasToken
    });
    
    useEffect(()=>{
      if(user){
        dispatch(setUser(user));
      }
    }, [dispatch, user])

    if(isLoading && hasToken) return (
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