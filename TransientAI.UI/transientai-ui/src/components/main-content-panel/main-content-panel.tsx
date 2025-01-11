import styles from './main-content-panel.module.scss';
import { Box, Tabs } from "@radix-ui/themes";

export function MainContentPanel() {


  return (
    <div className={styles['main-content']}>
      <Tabs.Root defaultValue="account" className='height-100p'>
        <Tabs.List>
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="account" className='height-100p'>
            <div className='height-100p tab-content'>
              Content goes here
            </div>
          </Tabs.Content>

          <Tabs.Content value="documents">

          </Tabs.Content>

          <Tabs.Content value="settings">

          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}