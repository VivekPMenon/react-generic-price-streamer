import { useUserContextStore } from '@/services/user-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { UserRole } from '@/services/user-context';
interface ProtectedRouteProps {
  children: ReactNode;
  resourceName?: string; // Optional: Restrict access by resource if needed
}

export default function ProtectedRoute({ children, resourceName }: ProtectedRouteProps) {
  const { userContext, authenticationError, isLoading } = useUserContextStore();
  const router = useRouter();

  useEffect(() => {
    if (authenticationError) {
      router.push('/login');
      return;
    }

    // if (resourceName && !userContext.accessibleResources?.find(resource => resource.resourceName === resourceName)) {
    //   router.push('/unauthorized');
    // }
  }, [authenticationError]);

  if (isLoading) {
    return <>loading...</>; // todo.. use nice loading screen 
  }

  if (authenticationError) {
    return <>Unuthenticated</>; //  todo.. nice auth erorr page :)
  }

  // if (resourceName && !userContext.accessibleResources?.find(resource => resource.resourceName === resourceName)) {
  //   return <>Unauthorized</>;
  // }

  if((userContext.userRole === UserRole.HUNTER ||  userContext.userRole === UserRole.CENTER_IBIS) && (resourceName === 'Hurricane PMS')) {
      router.push('/unauthorized');
  }

  if (userContext.userRole === UserRole.HUNTER) {
    if (resourceName === 'margin' || resourceName === 'pms-pnl') {
      return (
        <p className='text-base m-auto'>Access Restricted please contact admin.</p>
      );
    }
  }
  return <>{children}</>;
}
