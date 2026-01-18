import { useEffect, Suspense } from 'react'
import { useDispatch } from 'react-redux';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { setUser } from '../store/slices/authSlice';
import AnimatedRoutes from '../app/routes/AnimatedRoutes';
import { motion } from '@/utils/motionComponents';


const AuthLoader = () => {
    const dispatch = useDispatch();
    const {data: user, isLoading} = useGetCurrentUserQuery();


    useEffect(()=>{
      if(user){
        dispatch(setUser(user));
      }
    }, [dispatch, user])

    // Show unified loader for both auth check and route loading
    if(isLoading) return (
       <div className="flex justify-center items-center min-h-screen">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-emerald-600"
          />
       </div>
    )

    // Wrap AnimatedRoutes to catch any lazy loading with the same loader
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-emerald-600"
          />
        </div>
      }>
        <AnimatedRoutes />
      </Suspense>
    )
}

export default AuthLoader