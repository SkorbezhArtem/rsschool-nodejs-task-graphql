import { User } from '@prisma/client';

interface Subscribe {
  subscriberId: string;
  authorId: string;
}

export interface UserSubscription extends User {
  userSubscribedTo: Subscribe[];
}

export interface SubscriptionToUser extends User {
  subscribedToUser: Subscribe[];
}
