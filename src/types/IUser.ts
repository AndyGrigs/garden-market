 export interface User {
    id: string;
    _id?: string;
    email: string;
    fullName: string;
    role: 'user' | 'seller' |'admin';
    language?: string;
    isVerified?: boolean;
    sellerInfo?: {
      nurseryName?: string;
      address?: string;
      phoneNumber?: string;
      treeVarieties?: string[];
      isApproved?: boolean;
      businessLicense?: string;
      description?: string;
      registrationDate?: string;
  };
  buyerInfo?: {
    purchaseHistory?: string[];
    };
    
  }

  export interface ErrorResponse {
    data?: { message: string };
  }