import { UserContext } from '@/services/user-context';
import * as Popover from '@radix-ui/react-popover';

export interface ProfilePopoverProps {
  userContext: UserContext;
}

export default function ProfilePopover({ userContext }: ProfilePopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className='profile-initials'>{userContext.userInitials}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={1} className='translate-x-[-30px]'>
          <div className='profile-info'>
            <div className='top-row'>
              <span>HURRICANE CAPITAL</span>
              <span className='hyperlink primary'>Sign Out</span>
            </div>

            <div className='main-content'>
              <div className='profile-initials'>
                {userContext.userInitials}
              </div>

              <div className='profile-details'>
                <div className='profile-name'>
                  {userContext.userName}
                </div>
                <div>
                  {userContext.userId}
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
