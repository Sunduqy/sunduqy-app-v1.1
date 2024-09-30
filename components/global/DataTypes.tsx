import { Timestamp } from 'firebase/firestore';

export interface Category {
    id: string;
    title: string;
    icon: string;
    posts: Post[];
}

export interface FirestorePost {
    id: string;
    title: string;
    description: string;
    productStatus: string;
    manufacturingYear: string;
    city: string;
    price: number;
    images: string[];
    category: string;
    generalStatus: string;
    warranty: string;
    sellingReason: string;
    deliveryMethod: string;
    negotiable: string;
    usingDuration: string;
    accessories: string;
    color: string;
    isRocketPost: boolean;
    userId: string;
    postDate: Timestamp | null;
}

export interface Post {
    id: string;
    title: string;
    description: string;
    productStatus: string;
    manufacturingYear: string;
    city: string;
    price: number;
    images: string[];
    category: string;
    generalStatus: string;
    warranty: string;
    sellingReason: string;
    deliveryMethod: string;
    negotiable: string;
    usingDuration: string;
    accessories: string;
    color: string;
    isRocketPost: boolean;
    userId: string;
    postDate: string | null;
}

export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profileImage: string;
    signedUpTime: string;
    username: string;
    verifiedSeller: boolean;
    overallRating: number;
    ratingsCount: number;
    ratings: RatingsArray[];
}

export interface RatingsArray {
    comment: string;
    feedback: string;
    rating: number;
    submittedAt: Timestamp;
    userCreateRate: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
  }
  