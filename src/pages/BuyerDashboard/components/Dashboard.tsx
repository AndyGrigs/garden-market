import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../store/store";
import { useGetUserReviewsQuery } from "@/features/buyer/api/reviewApi";
import Title from "./Title";
import Profile from "./Profile";
import PurchaseHistory from "./PurchaseHistory";
import { UserReviews } from "./UserReviews";

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id ?? "";
  
  
  const { data: userReviews, isLoading: reviewsLoading, error: reviewsError } = useGetUserReviewsQuery(
    userId,
    { skip: !userId }
  );
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/*Title */}
          <Title name={user.fullName}/>

          {/* Profile Information */}
          <Profile fullName={user.fullName}/>

          {/* Purchase History */}
         <PurchaseHistory userId={userId}/>

          {/* User Reviews */}
          <UserReviews 
            userReviews={userReviews || []}
            reviewsLoading={reviewsLoading}
            reviewsError={!!reviewsError}
          />
        </div>
      </div>
    </div>
  );
}